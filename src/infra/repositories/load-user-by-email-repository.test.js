class LoadUserByEmailRepository {
  load (email) {
    return null
  }
}
describe('LoadUserByEmail repository', () => {
  test('should return null if no user is found', () => {
    const sut = new LoadUserByEmailRepository()
    const user = sut.load('invalid@gmail.com')
    expect(user).toBeNull()
  })
})
