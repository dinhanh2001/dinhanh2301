import { ExplainModel } from "./Explain"

test("can be created", () => {
  const instance = ExplainModel.create({})

  expect(instance).toBeTruthy()
})
