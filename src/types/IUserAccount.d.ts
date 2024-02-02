export default interface IUserAccount {
  id: string
  address: string
  quota: number
  used: number
  isDisabled: boolean
  isDeleted: boolean
  createdAtTimestamp: string
  updatedAtTimestamp: string
  token: string
  password?: string
  get createdAt(): Date
  get updatedAt(): Date
}
