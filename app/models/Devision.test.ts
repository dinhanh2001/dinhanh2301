import { DevisionModel } from "./Devision"

test("can be created", () => {
  const instance = DevisionModel.create({})

  expect(instance).toBeTruthy()
})
