export default interface UserAccount {
  id: string
  address: string
  quota: number
  used: number
  isDisabled: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  token: string
  password?: string
}
