import { PlaceModel } from "./Place"

test("can be created", () => {
  const instance = PlaceModel.create({})

  expect(instance).toBeTruthy()
})
