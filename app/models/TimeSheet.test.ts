import { TimeSheetModel } from "./TimeSheet"

test("can be created", () => {
  const instance = TimeSheetModel.create({})

  expect(instance).toBeTruthy()
})
