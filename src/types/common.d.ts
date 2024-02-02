export interface IDomain {
  id: string
  domain: string
  isActive: boolean
  isPrivate: boolean
  createdAtTimestamp: string
  updatedAtTimestamp: string
  get createdAt(): Date
  get updatedAt(): Date
}

export interface IMail<Cache extends boolean = false> {
  id: string
  html?: If<Cache, undefined, string[]>
  msgid: string
  from: {
    address: string
    name: string
  }
  to: Array<{
    address: string
    name: string
  }>
  subject: string
  intro: string
  seen: boolean
  isDeleted: boolean
  hasAttachments: boolean
  downloadUrl: string
  size: number
  createdAtTimestamp: string
  updatedAtTimestamp: string
  get createdAt(): Date
  get updatedAt(): Date
}

export type If<Condition extends boolean, Then, Else> = Condition extends true ? Then : Else
