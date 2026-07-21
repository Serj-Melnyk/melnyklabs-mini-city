export type ContactPayload = {
  name: string
  email: string
  projectType: string
  message: string
}

export function formatContactMessage(payload: ContactPayload) {
  return [
    'MelnykLabs project inquiry',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project type: ${payload.projectType}`,
    '',
    payload.message,
  ].join('\n')
}
