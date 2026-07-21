"""Generate the reproducible low-poly GLB asset set for MelnykLabs Mini City.

Run from the repository root:

    blender --background --python tools/blender/generate_city_assets.py

The generated models intentionally use original geometry and embedded materials only.
This keeps the production payload small, avoids texture seams, and preserves the matte
toy diorama look of the approved concept, including the MelnykLabs sports car.
"""

from pathlib import Path
import math

import bpy


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "assets" / "models"
OUTPUT.mkdir(parents=True, exist_ok=True)


PALETTE = {
    "ink": "#142039",
    "ink_dark": "#081329",
    "cream": "#FFF0D3",
    "cream_dark": "#D7C7AA",
    "coral": "#F26B4F",
    "coral_light": "#FF9A7F",
    "mint": "#6ED8C5",
    "mint_dark": "#3F8F8A",
    "mustard": "#E4AD52",
    "mustard_dark": "#A86F32",
    "lavender": "#777994",
    "lavender_dark": "#50536E",
    "green": "#788954",
    "wood": "#735041",
    "glass": "#203956",
    "glass_light": "#7FD5D0",
    "skin": "#9B644A",
    "white": "#F7F3E8",
}


def hex_rgba(value: str, alpha: float = 1.0):
    value = value.lstrip("#")
    srgb = tuple(int(value[index:index + 2], 16) / 255 for index in (0, 2, 4))

    def to_scene_linear(channel):
        if channel <= 0.04045:
            return channel / 12.92
        return ((channel + 0.055) / 1.055) ** 2.4

    return tuple(to_scene_linear(channel) for channel in srgb) + (alpha,)


def web_location(location):
    """Convert Three.js x/y/z coordinates to Blender x/y/z coordinates."""
    x, y, z = location
    return (x, -z, y)


def reset_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for block in list(data):
            data.remove(block)


def material(name, color, *, roughness=0.84, metallic=0.0, emission=None, alpha=1.0):
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    result.diffuse_color = hex_rgba(color, alpha)
    shader = result.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = hex_rgba(color, alpha)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    if emission:
        emission_input = shader.inputs.get("Emission Color") or shader.inputs.get("Emission")
        emission_input.default_value = hex_rgba(emission)
        shader.inputs["Emission Strength"].default_value = 0.18
    if alpha < 1:
        shader.inputs["Alpha"].default_value = alpha
        result.surface_render_method = "DITHERED"
    return result


def finish_object(obj, mat=None, bevel=0.0):
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new("Soft toy edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    return obj


def box(name, size, location=(0, 0, 0), mat=None, bevel=0.0, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=web_location(location), rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish_object(obj, mat, bevel)


def cylinder(name, radius, depth, location=(0, 0, 0), mat=None, vertices=12, rotation=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=web_location(location),
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    return finish_object(obj, mat, bevel)


def sphere(name, radius, location=(0, 0, 0), mat=None, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions,
        radius=radius,
        location=web_location(location),
    )
    obj = bpy.context.object
    obj.name = name
    return finish_object(obj, mat)


def station_shell(name, stations, mat=None, bevel=0.0):
    """Build a faceted shell from x/y/half-width stations in web coordinates."""
    vertices = []
    for x, lower_y, upper_y, half_width in stations:
        vertices.extend([
            web_location((x, lower_y, -half_width)),
            web_location((x, lower_y, half_width)),
            web_location((x, upper_y, -half_width)),
            web_location((x, upper_y, half_width)),
        ])

    faces = []
    for index in range(len(stations) - 1):
        start = index * 4
        next_start = (index + 1) * 4
        faces.extend([
            (start, next_start, next_start + 1, start + 1),
            (start + 2, start + 3, next_start + 3, next_start + 2),
            (start, start + 2, next_start + 2, next_start),
            (start + 1, next_start + 1, next_start + 3, start + 3),
        ])
    faces.extend([
        (0, 1, 3, 2),
        tuple(range((len(stations) - 1) * 4, len(stations) * 4)),
    ])

    mesh = bpy.data.meshes.new(f"{name}Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return finish_object(obj, mat, bevel)


def empty(name, location=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(obj)
    obj.location = web_location(location)
    return obj


def parent_keep_world(child, parent):
    # Newly created empties do not always have an evaluated matrix yet. Without
    # this update, exported guide pivots collapse to the asset origin and limb
    # rotations make the arms and legs appear detached.
    bpy.context.view_layer.update()
    matrix = child.matrix_world.copy()
    child.parent = parent
    child.matrix_world = matrix
    bpy.context.view_layer.update()


def window_row(width, height, z, count, depth, mat, prefix="Window"):
    gap = 0.16
    pane_width = (width - gap * (count + 1)) / count
    start = -width / 2 + gap + pane_width / 2
    for index in range(count):
        x = start + index * (pane_width + gap)
        box(
            f"{prefix}_{index + 1}",
            (pane_width, height, 0.08),
            (x, z, depth),
            mat,
            bevel=0.025,
        )


def planter(x, y, z, pot, leaves, name):
    box(f"{name}_Pot", (0.42, 0.28, 0.3), (x, y, z), pot, bevel=0.05)
    for index, offset in enumerate((-0.12, 0.0, 0.12)):
        sphere(f"{name}_Leaf_{index}", 0.16, (x + offset, y + 0.25, z), leaves)


def facade_text(name, value, location, mat, size=0.2, extrude=0.008):
    """Create centered, lightweight mesh lettering facing the web +z facade."""
    bpy.ops.object.text_add(location=web_location(location), rotation=(math.pi / 2, 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = value
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = 0.003
    obj.data.space_line = 0.86
    bpy.ops.object.convert(target="MESH")
    return finish_object(obj, mat)


def export_asset(filename):
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.select_set(True)
    kwargs = {
        "filepath": str(OUTPUT / filename),
        "export_format": "GLB",
        "export_yup": True,
        "export_apply": True,
        "export_materials": "EXPORT",
        "export_cameras": False,
        "export_lights": False,
    }
    properties = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    if "export_draco_mesh_compression_enable" in properties:
        kwargs.update({
            "export_draco_mesh_compression_enable": True,
            "export_draco_mesh_compression_level": 6,
            "export_draco_position_quantization": 14,
            "export_draco_normal_quantization": 10,
        })
    bpy.ops.export_scene.gltf(**kwargs)
    print(f"Exported {filename}")


def build_plaza():
    reset_scene()
    stone = material("Plaza stone", PALETTE["cream_dark"])
    pale = material("Monument", PALETTE["cream"])
    water = material("Water", PALETTE["mint"], roughness=0.45, metallic=0.05)
    cylinder("OctagonalPlinth", 1.15, 0.34, (0, -0.18, 0), stone, vertices=8, bevel=0.06)
    cylinder("WaterBasin", 0.83, 0.16, (0, 0.03, 0), pale, vertices=16, bevel=0.04)
    cylinder("WaterSurface", 0.67, 0.035, (0, 0.13, 0), water, vertices=24)
    cylinder("ObeliskBase", 0.31, 0.32, (0, 0.3, 0), stone, vertices=8, bevel=0.035)
    box("Obelisk", (0.28, 1.42, 0.28), (0, 1.12, 0), pale, bevel=0.035)
    bpy.ops.mesh.primitive_cone_add(
        vertices=4,
        radius1=0.2,
        radius2=0.0,
        depth=0.38,
        location=web_location((0, 2.02, 0)),
        rotation=(0, 0, math.radians(45)),
    )
    finish_object(bpy.context.object, pale)
    export_asset("plaza-landmark.glb")


def build_studio():
    reset_scene()
    navy = material("Studio navy", PALETTE["ink"])
    teal = material("Studio teal", PALETTE["mint"])
    trim = material("Cream trim", PALETTE["cream"])
    glass = material("Studio glass", PALETTE["glass"], roughness=0.36, metallic=0.08, emission=PALETTE["glass_light"])
    green = material("Planter leaves", PALETTE["green"])
    wood = material("Planter", PALETTE["wood"])
    box("StudioBody", (3.2, 3.6, 2.4), (0, 0, 0), navy, bevel=0.14)
    box("StudioFrameLeft", (0.12, 3.5, 0.12), (-1.61, 0, 1.25), teal, bevel=0.035)
    box("StudioFrameRight", (0.12, 3.5, 0.12), (1.61, 0, 1.25), teal, bevel=0.035)
    box("StudioFrameTop", (3.28, 0.12, 0.12), (0, 1.74, 1.25), teal, bevel=0.035)
    box("StudioFrameBottom", (3.28, 0.12, 0.12), (0, -1.74, 1.25), teal, bevel=0.035)
    box("StudioTealFrame", (3.34, 0.2, 2.54), (0, 1.68, 0), teal, bevel=0.06)
    box("StudioRoof", (2.76, 0.28, 1.96), (0, 1.94, 0), trim, bevel=0.08)
    box("StudioDoor", (0.68, 1.0, 0.12), (0, -1.28, 1.23), glass, bevel=0.03)
    window_row(2.5, 0.62, 0.8, 3, 1.23, glass, "StudioUpperWindow")
    window_row(2.5, 0.54, -0.45, 3, 1.23, glass, "StudioLowerWindow")
    box("CodeSign", (0.86, 0.62, 0.1), (0, 0.72, 1.31), teal, bevel=0.08)
    box("CodeSlash", (0.08, 0.38, 0.06), (0, 0.72, 1.38), trim, bevel=0.02, rotation=(0, math.radians(18), 0))
    facade_text("StudioLabel", "DEVELOPER\nSTUDIO", (0, 0.08, 1.37), trim, size=0.18)
    planter(-1.05, -1.62, 1.24, wood, green, "StudioPlanterLeft")
    planter(1.05, -1.62, 1.24, wood, green, "StudioPlanterRight")
    export_asset("developer-studio.glb")


def build_projects():
    reset_scene()
    mustard = material("Project mustard", PALETTE["mustard"])
    deep = material("Project shadow", PALETTE["mustard_dark"])
    cream = material("Project cream", PALETTE["cream"])
    coral = material("Project coral", PALETTE["coral_light"])
    glass = material("Project glass", PALETTE["glass"], roughness=0.4)
    green = material("Project plants", PALETTE["green"])
    wood = material("Project planters", PALETTE["wood"])
    box("ProjectBody", (2.8, 2.3, 2.4), (0, 0, 0), mustard, bevel=0.14)
    box("ProjectCornice", (3.02, 0.28, 2.58), (0, 1.05, 0), deep, bevel=0.06)
    box("ProjectRoof", (2.48, 0.24, 2.0), (0, 1.33, 0), cream, bevel=0.07)
    box("ProjectSign", (2.0, 0.58, 0.11), (0, 0.5, 1.25), deep, bevel=0.06)
    facade_text("ProjectLabel", "PROJECT\nDISTRICT 3", (0, 0.5, 1.32), cream, size=0.17)
    box("ProjectDoor", (0.62, 0.9, 0.1), (0.46, -0.7, 1.24), glass, bevel=0.03)
    box("ProjectWindow", (1.05, 0.66, 0.1), (-0.55, -0.62, 1.24), glass, bevel=0.03)
    for index, x in enumerate((-0.92, -0.46, 0.0, 0.46, 0.92)):
        awning_mat = cream if index % 2 == 0 else coral
        box(f"Awning_{index}", (0.46, 0.18, 0.64), (x, -0.16, 1.48), awning_mat, bevel=0.035, rotation=(math.radians(-10), 0, 0))
    planter(-0.92, -0.98, 1.27, wood, green, "ProjectPlanterLeft")
    planter(0.92, -0.98, 1.27, wood, green, "ProjectPlanterRight")
    export_asset("project-district.glb")


def build_project_one():
    reset_scene()
    coral = material("District one coral", PALETTE["coral"])
    coral_light = material("District one highlight", PALETTE["coral_light"])
    cream = material("District one cream", PALETTE["cream"])
    dark = material("District one sign", PALETTE["wood"])
    glass = material("District one glass", PALETTE["glass"], roughness=0.38)
    green = material("District one plants", PALETTE["green"])
    wood = material("District one planters", PALETTE["wood"])

    box("DistrictOneBody", (3.0, 2.8, 2.4), (0, 0, 0), coral, bevel=0.14)
    box("DistrictOneInset", (2.58, 2.34, 0.14), (0, 0.02, 1.23), coral_light, bevel=0.08)
    box("DistrictOneCornice", (3.18, 0.26, 2.58), (0, 1.3, 0), dark, bevel=0.06)
    box("DistrictOneRoof", (2.72, 0.22, 2.06), (0, 1.55, 0), cream, bevel=0.07)
    box("DistrictOneRoofCap", (0.62, 0.28, 0.5), (-0.7, 1.75, -0.35), dark, bevel=0.06)
    box("DistrictOneSign", (1.84, 0.62, 0.11), (0.37, 0.62, 1.34), dark, bevel=0.05)
    facade_text("DistrictOneLabel", "PROJECT\nDISTRICT 1", (0.37, 0.62, 1.41), cream, size=0.17)
    box("DistrictOneDoor", (0.64, 0.98, 0.11), (0.48, -0.86, 1.35), glass, bevel=0.03)
    box("DistrictOneWindow", (1.12, 0.7, 0.11), (-0.52, -0.72, 1.35), glass, bevel=0.03)
    for index, x in enumerate((-0.86, -0.43, 0.0, 0.43, 0.86)):
        awning_mat = cream if index % 2 == 0 else coral_light
        box(
            f"DistrictOneAwning_{index}",
            (0.43, 0.18, 0.68),
            (x, -0.18, 1.55),
            awning_mat,
            bevel=0.03,
            rotation=(math.radians(-10), 0, 0),
        )
    box("DistrictOneIconBack", (0.42, 0.52, 0.1), (-0.9, 0.66, 1.35), cream, bevel=0.04)
    box("DistrictOneIcon", (0.22, 0.3, 0.08), (-0.9, 0.66, 1.42), coral_light, bevel=0.035)
    planter(-1.0, -1.12, 1.36, wood, green, "DistrictOnePlanterLeft")
    planter(1.0, -1.12, 1.36, wood, green, "DistrictOnePlanterRight")
    export_asset("project-district-one.glb")


def build_project_two():
    reset_scene()
    teal = material("District two teal", PALETTE["mint_dark"])
    mint = material("District two mint", PALETTE["mint"])
    cream = material("District two cream", PALETTE["cream"])
    dark = material("District two sign", PALETTE["ink"])
    glass = material("District two glass", PALETTE["glass"], roughness=0.34)
    green = material("District two plants", PALETTE["green"])
    wood = material("District two planters", PALETTE["wood"])

    box("DistrictTwoBody", (2.8, 2.0, 2.4), (0, 0, 0), teal, bevel=0.14)
    box("DistrictTwoCornice", (2.98, 0.25, 2.58), (0, 0.9, 0), dark, bevel=0.06)
    box("DistrictTwoRoof", (2.52, 0.22, 2.04), (0, 1.15, 0), cream, bevel=0.07)
    box("DistrictTwoRoofCap", (0.62, 0.24, 0.5), (-0.6, 1.34, -0.3), dark, bevel=0.055)
    box("DistrictTwoSign", (1.82, 0.54, 0.11), (0.28, 0.42, 1.3), dark, bevel=0.05)
    facade_text("DistrictTwoLabel", "PROJECT\nDISTRICT 2", (0.28, 0.42, 1.37), cream, size=0.16)
    box("DistrictTwoDoor", (0.62, 0.9, 0.11), (0.48, -0.56, 1.29), glass, bevel=0.03)
    box("DistrictTwoWindow", (1.0, 0.64, 0.11), (-0.48, -0.49, 1.29), glass, bevel=0.03)
    for index, x in enumerate((-0.84, -0.42, 0.0, 0.42, 0.84)):
        awning_mat = cream if index % 2 == 0 else mint
        box(
            f"DistrictTwoAwning_{index}",
            (0.42, 0.17, 0.62),
            (x, -0.05, 1.48),
            awning_mat,
            bevel=0.03,
            rotation=(math.radians(-10), 0, 0),
        )
    box("DistrictTwoIconBack", (0.46, 0.5, 0.1), (-0.88, 0.43, 1.3), cream, bevel=0.04)
    for index, x in enumerate((-0.98, -0.88, -0.78)):
        box(
            f"DistrictTwoMountain_{index}",
            (0.08, 0.28 - abs(index - 1) * 0.07, 0.07),
            (x, 0.42, 1.37),
            mint,
            bevel=0.018,
            rotation=(0, math.radians((index - 1) * 25), 0),
        )
    planter(-0.92, -0.86, 1.31, wood, green, "DistrictTwoPlanterLeft")
    planter(0.92, -0.86, 1.31, wood, green, "DistrictTwoPlanterRight")
    export_asset("project-district-two.glb")


def build_garage():
    reset_scene()
    lavender = material("Garage lavender", PALETTE["lavender"])
    dark = material("Garage dark", PALETTE["lavender_dark"])
    cream = material("Garage trim", PALETTE["cream"])
    coral = material("Garage marker", PALETTE["coral"])
    box("GarageBody", (3.0, 2.0, 2.4), (0, 0, 0), lavender, bevel=0.13)
    box("GarageRoof", (3.18, 0.25, 2.56), (0, 1.04, 0), dark, bevel=0.06)
    box("GarageDoor", (1.72, 1.12, 0.12), (-0.32, -0.38, 1.24), dark, bevel=0.035)
    for index in range(5):
        box(f"GarageDoorSlat_{index}", (1.55, 0.035, 0.025), (-0.32, -0.8 + index * 0.24, 1.32), cream)
    box("GarageSign", (2.06, 0.42, 0.1), (0, 0.62, 1.25), cream, bevel=0.05)
    facade_text("GarageLabel", "SERVICE\nGARAGE", (-0.18, 0.62, 1.32), dark, size=0.17)
    box("WrenchStem", (0.12, 0.46, 0.08), (0.72, 0.64, 1.33), dark, bevel=0.025, rotation=(0, math.radians(-28), 0))
    cylinder("WrenchHead", 0.16, 0.08, (0.83, 0.84, 1.34), dark, vertices=8, rotation=(math.pi / 2, 0, 0))
    for index, x in enumerate((0.75, 1.05, 1.33)):
        cylinder(f"Bollard_{index}", 0.09, 0.5, (x, -0.7, 1.33), coral if index == 1 else cream, vertices=12, bevel=0.02)
    export_asset("service-garage.glb")


def build_lab():
    reset_scene()
    teal = material("Lab teal", PALETTE["mint_dark"])
    mint = material("Lab mint", PALETTE["mint"])
    dark = material("Lab dark", PALETTE["ink"])
    glass = material("Lab glass", PALETTE["glass"], roughness=0.3, metallic=0.1, emission=PALETTE["glass_light"])
    cream = material("Lab trim", PALETTE["cream"])
    box("LabBody", (3.4, 1.7, 2.4), (0, 0, 0), teal, bevel=0.14)
    box("LabRoof", (3.12, 0.22, 2.1), (0, 0.96, 0), dark, bevel=0.06)
    window_row(2.75, 0.62, -0.32, 4, 1.23, glass, "LabWindow")
    box("LabDoor", (0.62, 0.9, 0.1), (1.02, -0.42, 1.24), dark, bevel=0.03)
    facade_text("LabLabel", "INNOVATION\nLAB", (-0.62, 0.38, 1.31), cream, size=0.18)
    cylinder("DomeBase", 0.73, 0.12, (-0.55, 1.13, 0), cream, vertices=12)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.62, location=web_location((-0.55, 1.39, 0)))
    dome = bpy.context.object
    dome.name = "LabDome"
    dome.scale.z = 0.58
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish_object(dome, glass)
    cylinder("FlaskNeck", 0.08, 0.34, (0.62, 0.48, 1.31), cream, vertices=10)
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.22, radius2=0.08, depth=0.4, location=web_location((0.62, 0.22, 1.31)))
    finish_object(bpy.context.object, mint)
    export_asset("innovation-lab.glb")


def build_contact():
    reset_scene()
    cream = material("Contact cream", PALETTE["cream"])
    coral = material("Contact coral", PALETTE["coral"])
    dark = material("Contact dark", PALETTE["ink"])
    metal = material("Dish metal", PALETTE["lavender"], roughness=0.55, metallic=0.22)
    box("ContactBody", (2.8, 2.2, 2.4), (0, 0, 0), cream, bevel=0.14)
    box("ContactRoof", (2.52, 0.23, 2.06), (0, 1.22, 0), dark, bevel=0.06)
    box("ContactDoor", (0.7, 1.05, 0.12), (-0.48, -0.58, 1.24), dark, bevel=0.035)
    box("ContactWindow", (0.94, 0.62, 0.1), (0.58, -0.2, 1.24), dark, bevel=0.035)
    facade_text("ContactLabel", "CONTACT\nSTATION", (0.58, 0.42, 1.31), dark, size=0.17)
    box("ContactAwning", (1.55, 0.18, 0.78), (0.08, 0.18, 1.5), coral, bevel=0.05, rotation=(math.radians(-10), 0, 0))
    cylinder("DishStand", 0.06, 0.5, (0.62, 1.56, 0), dark, vertices=10)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.5, location=web_location((0.62, 1.77, 0.05)))
    dish = bpy.context.object
    dish.name = "SatelliteDish"
    dish.scale = (1.0, 0.24, 0.72)
    dish.rotation_euler = (math.radians(20), 0, math.radians(-24))
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    finish_object(dish, metal)
    box("MailboxPost", (0.11, 0.74, 0.11), (1.3, -0.74, 1.28), dark, bevel=0.025)
    box("Mailbox", (0.48, 0.46, 0.34), (1.3, -0.28, 1.28), coral, bevel=0.08)
    export_asset("contact-station.glb")


def build_car():
    reset_scene()
    coral = material("MelnykLabs coral", PALETTE["coral"], roughness=0.7)
    coral_light = material("MelnykLabs highlight", PALETTE["coral_light"], roughness=0.68)
    dark = material("Sports aero", PALETTE["ink_dark"], roughness=0.72)
    glass = material("Sports glass", PALETTE["glass"], roughness=0.3, metallic=0.1)
    cream = material("Headlights", PALETTE["cream"], emission=PALETTE["cream"])
    tail = material("Tail lights", PALETTE["coral_light"], emission=PALETTE["coral_light"])
    rim = material("Wheel rims", PALETTE["lavender"], roughness=0.48, metallic=0.36)

    station_shell(
        "SportsBody",
        (
            (-0.98, 0.16, 0.43, 0.33),
            (-0.72, 0.11, 0.53, 0.44),
            (0.3, 0.1, 0.43, 0.44),
            (0.72, 0.12, 0.31, 0.39),
            (1.0, 0.18, 0.25, 0.27),
        ),
        coral,
        bevel=0.035,
    )
    station_shell(
        "SportsGlassCanopy",
        (
            (-0.48, 0.48, 0.55, 0.3),
            (-0.29, 0.53, 0.76, 0.31),
            (0.14, 0.5, 0.76, 0.3),
            (0.42, 0.43, 0.48, 0.27),
        ),
        glass,
        bevel=0.025,
    )
    box("SportsRoofSpine", (0.46, 0.045, 0.62), (-0.07, 0.78, 0), dark, bevel=0.018)
    box("FrontSplitter", (0.35, 0.055, 0.74), (0.84, 0.08, 0), dark, bevel=0.025)
    box("RearDiffuser", (0.18, 0.1, 0.76), (-0.91, 0.11, 0), dark, bevel=0.025)
    box("RearSpoilerBlade", (0.13, 0.07, 0.8), (-0.78, 0.65, 0), dark, bevel=0.025)
    for side in (-0.29, 0.29):
        box(f"RearSpoilerStand_{side}", (0.07, 0.24, 0.06), (-0.76, 0.53, side), dark, bevel=0.018)
        box(f"SideIntake_{side}", (0.28, 0.13, 0.035), (-0.36, 0.26, side * 1.48), dark, bevel=0.018)

    for side in (-1, 1):
        for x in (-0.59, 0.56):
            cylinder(
                f"Wheel_{side}_{x}",
                0.225,
                0.16,
                (x, 0.19, side * 0.43),
                dark,
                vertices=14,
                rotation=(math.pi / 2, 0, 0),
                bevel=0.018,
            )
            cylinder(
                f"WheelRim_{side}_{x}",
                0.12,
                0.172,
                (x, 0.19, side * 0.43),
                rim,
                vertices=10,
                rotation=(math.pi / 2, 0, 0),
            )
    for side in (-0.2, 0.2):
        box(f"Headlight_{side}", (0.055, 0.09, 0.18), (0.94, 0.25, side), cream, bevel=0.018)
        box(f"TailLight_{side}", (0.045, 0.09, 0.2), (-0.96, 0.34, side), tail, bevel=0.018)
    box("SportsAccent", (0.48, 0.035, 0.05), (0.45, 0.47, 0), coral_light, bevel=0.012)
    export_asset("melnyklabs-sports-car.glb")


def build_guide():
    reset_scene()
    green = material("Guide shirt", PALETTE["green"])
    skin = material("Guide skin", PALETTE["skin"])
    dark = material("Guide navy", PALETTE["ink"])
    hair = material("Guide hair", PALETTE["wood"])

    root = empty("GuideAsset")
    body_pivot = empty("BodyPivot")
    head_pivot = empty("HeadPivot", (0, 1.52, 0))
    left_arm_pivot = empty("LeftArmPivot", (-0.29, 1.17, 0))
    right_arm_pivot = empty("RightArmPivot", (0.29, 1.17, 0))
    left_leg_pivot = empty("LeftLegPivot", (-0.12, 0.58, 0))
    right_leg_pivot = empty("RightLegPivot", (0.12, 0.58, 0))
    for pivot in (body_pivot, head_pivot, left_arm_pivot, right_arm_pivot, left_leg_pivot, right_leg_pivot):
        parent_keep_world(pivot, root)

    body = cylinder("GuideBody", 0.24, 0.74, (0, 0.98, 0), green, vertices=12, bevel=0.05)
    head = sphere("GuideHead", 0.27, (0, 1.52, 0), skin, subdivisions=2)
    hair_cap = sphere("GuideHair", 0.23, (0, 1.71, -0.04), hair, subdivisions=1)
    for obj in (body,):
        parent_keep_world(obj, body_pivot)
    for obj in (head, hair_cap):
        parent_keep_world(obj, head_pivot)

    left_arm = cylinder("GuideLeftArm", 0.08, 0.5, (-0.29, 0.93, 0), green, vertices=10, bevel=0.025)
    right_arm = cylinder("GuideRightArm", 0.08, 0.5, (0.29, 0.93, 0), green, vertices=10, bevel=0.025)
    left_leg = cylinder("GuideLeftLeg", 0.095, 0.52, (-0.12, 0.33, 0), dark, vertices=10, bevel=0.025)
    right_leg = cylinder("GuideRightLeg", 0.095, 0.52, (0.12, 0.33, 0), dark, vertices=10, bevel=0.025)
    parent_keep_world(left_arm, left_arm_pivot)
    parent_keep_world(right_arm, right_arm_pivot)
    parent_keep_world(left_leg, left_leg_pivot)
    parent_keep_world(right_leg, right_leg_pivot)
    export_asset("guide-character.glb")


def main():
    builders = (
        build_plaza,
        build_studio,
        build_projects,
        build_project_one,
        build_project_two,
        build_garage,
        build_lab,
        build_contact,
        build_car,
        build_guide,
    )
    for builder in builders:
        builder()
    reset_scene()
    print(f"Generated {len(builders)} assets in {OUTPUT}")


if __name__ == "__main__":
    main()
