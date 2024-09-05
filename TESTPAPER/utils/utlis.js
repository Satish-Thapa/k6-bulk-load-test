import { check } from "k6"

export const checkSucessStatusCode = (res) =>
  check(res, {
    "status code should be 200": (res) => res.status === 200,
  })

export const checkBulkStatus = (status) =>
  check(status, {
    "status should not be failed": (status) => status === "Completed",
  })
