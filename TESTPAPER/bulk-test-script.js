import http from "k6/http"
import { group, sleep } from "k6"
import { execCommonRequest, login } from "./common/commonRequest.js"
import { pollForCompletion } from "./common/poolRequest.js"
import { checkSucessStatusCode } from "./utils/utlis.js"
import { Trend } from "k6/metrics"

const bulkExportTime = new Trend("bulk_export_time", true)

export const options = {
  vus: 50,
  thresholds: { http_req_duration: ["avg<150"] },
  noConnectionReuse: true,
  summaryTrendStats: ["avg", "min", "max", "count"],
  scenarios: {
    loadTest: {
      executor: "ramping-vus",
      stages: [
        { duration: "1m", target: 1 }, // Ramp up to 10 VUs
        // { duration: "2m", target: 500 }, // Stay at 10 VUs
        // { duration: "50s", target: 0 }, // Ramp down to 0 VUs
      ],
    },
  },
}

export default function () {
  group("Peform bulk export", () => {
    let response = login(__ENV.USERNAME, __ENV.PASSWORD)

    const token = JSON.parse(response.body).data.login.token

    const isLoginSucessFull = checkSucessStatusCode(response)

    if (isLoginSucessFull) {
      sleep(2)

      execCommonRequest(token)

      const bulkExportResponse = http.post(
        "https://api-devtestpaper.innovatetech.io/graphql",
        '{"operationName":"bulkExportQuestions","variables":{"bucketId":"592d0207-a297-40fc-85a2-2c5fc0f6ab24"},"query":"mutation bulkExportQuestions($bucketId: String, $testpaperId: String) {\\n  bulkExportQuestions(bucketId: $bucketId, testpaperId: $testpaperId) {\\n    bulkExportId\\n    __typename\\n  }\\n}\\n"}',
        {
          headers: {
            authorization: token,
            "content-type": "application/json",
          },
        }
      )
      const bulkExportId = JSON.parse(bulkExportResponse.body).data
        .bulkExportQuestions.bulkExportId

      pollForCompletion(token, bulkExportId, "bulkExport", bulkExportTime)

      sleep(1)
    } else {
      console.error("Login failed")
    }
  })
  // group("Peform bulk import", () => {
  //   let response = login(__ENV.USERNAME, __ENV.PASSWORD)

  //   const token = JSON.parse(response.body).data.login.token

  //   const isLoginSucessFull = checkSucessStatusCode(response)

  //   if (isLoginSucessFull) {
  //     sleep(2)

  //     execCommonRequest(token)

  //     const bulkExportResponse = http.post(
  //       "https://api-devtestpaper.innovatetech.io/graphql",
  //       '{"operationName":"bulkExportQuestions","variables":{"bucketId":"592d0207-a297-40fc-85a2-2c5fc0f6ab24"},"query":"mutation bulkExportQuestions($bucketId: String, $testpaperId: String) {\\n  bulkExportQuestions(bucketId: $bucketId, testpaperId: $testpaperId) {\\n    bulkExportId\\n    __typename\\n  }\\n}\\n"}',
  //       {
  //         headers: {
  //           authorization: token,
  //           "content-type": "application/json",
  //         },
  //       }
  //     )
  //     // const bulkExportId = JSON.parse(bulkExportResponse.body).data
  //     //   .bulkExportQuestions.bulkExportId

  //     pollForCompletion(token, bulkExportId, "bulkExport", bulkExportTime)

  //     sleep(1)
  //   } else {
  //     console.error("Login failed")
  //   }
  // })
}
