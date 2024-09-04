import http from "k6/http"
import { check, group, sleep } from "k6"
import { execCommonRequest, login } from "./common/commonRequest.js"
import { pollForCompletion } from "./common/poolRequest.js"
import { checkSucessStatusCode } from "./utils/utlis.js"
import { Trend } from "k6/metrics"
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js"

const bulkExportTrend = new Trend("bulk_export_time", true)
const bulkImportTrend = new Trend("bulk_import_time", true)
// Read the file you want to upload

const file = open("./bulk-file/bulk.xlsx", "b")

export const options = {
  vus: 50,
  thresholds: { http_req_duration: ["avg<150"] },
  noConnectionReuse: true,
  summaryTrendStats: ["avg", "min", "max", "count"],
  scenarios: {
    loadTest: {
      executor: "ramping-vus",
      stages: [
        { duration: "10s", target: 1 }, // Ramp up to 10 VUs
        // { duration: "5m", target: 500 }, // Stay at 10 VUs
        // { duration: "50s", target: 10 }, // Ramp down to 0 VUs
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

      pollForCompletion(token, bulkExportId, "bulkExport", bulkExportTrend)

      sleep(1)
    } else {
      console.error("Login failed")
    }
  })
  group("Peform bulk import", () => {
    let response = login(__ENV.USERNAME, __ENV.PASSWORD)

    const token = JSON.parse(response.body).data.login.token

    const isLoginSucessFull = checkSucessStatusCode(response)

    if (isLoginSucessFull) {
      sleep(2)

      execCommonRequest(token)

      const formData = new FormData()
      formData.boundary = "----WebKitFormBoundaryBL36C9EWTsPve1Zl"

      formData.append(
        "operations",
        '{"operationName":"BulkValidateQuestions","variables":{"file":null,"bucketId":"3dfdb8df-1985-4a24-bd2b-21361feca072","syllabusId":"b7788e0d-87e7-468b-b6db-112c1251dec6"},"query":"mutation BulkValidateQuestions($file: Upload!, $bucketId: String!, $syllabusId: String!) {\\n  bulkValidateQuestions(file: $file, bucketId: $bucketId, syllabusId: $syllabusId) {\\n    questions {\\n      answersList {\\n        answer\\n        blankId\\n        guidance\\n        isCorrect\\n        label\\n        answerText\\n        marks\\n        order\\n        remarks\\n        __typename\\n      }\\n      bucketId\\n      isFitb\\n      clientId\\n      difficulty\\n      errors\\n      hasMultipleAnswers\\n      mcqOptionsCount\\n      hasOptions\\n      hasSubQuestions\\n      isAutoGraded\\n      isCustomEnabled\\n      isValid\\n      marks\\n      maxOptionsCount\\n      optionsList {\\n        answer\\n        blankId\\n        guidance\\n        isCorrect\\n        label\\n        marks\\n        order\\n        remarks\\n        __typename\\n      }\\n      question\\n      questionsList {\\n        questionText\\n        questionsList {\\n          questionText\\n          questionType\\n          reference\\n          syllabusContentIdList\\n          syllabusId\\n          userId\\n          answersList {\\n            answer\\n            blankId\\n            guidance\\n            isCorrect\\n            label\\n            answerText\\n            marks\\n            order\\n            remarks\\n            __typename\\n          }\\n          bucketId\\n          isFitb\\n          clientId\\n          difficulty\\n          errors\\n          hasMultipleAnswers\\n          mcqOptionsCount\\n          hasOptions\\n          hasSubQuestions\\n          isAutoGraded\\n          isCustomEnabled\\n          isValid\\n          marks\\n          maxOptionsCount\\n          optionsList {\\n            answer\\n            blankId\\n            guidance\\n            isCorrect\\n            label\\n            marks\\n            order\\n            remarks\\n            __typename\\n          }\\n          question\\n          __typename\\n        }\\n        questionType\\n        reference\\n        syllabusContentIdList\\n        syllabusId\\n        userId\\n        answersList {\\n          answer\\n          blankId\\n          guidance\\n          isCorrect\\n          label\\n          answerText\\n          marks\\n          order\\n          remarks\\n          __typename\\n        }\\n        bucketId\\n        isFitb\\n        clientId\\n        difficulty\\n        errors\\n        hasMultipleAnswers\\n        mcqOptionsCount\\n        hasOptions\\n        hasSubQuestions\\n        isAutoGraded\\n        isCustomEnabled\\n        isValid\\n        marks\\n        maxOptionsCount\\n        optionsList {\\n          answer\\n          blankId\\n          guidance\\n          isCorrect\\n          label\\n          marks\\n          order\\n          remarks\\n          __typename\\n        }\\n        question\\n        __typename\\n      }\\n      questionText\\n      questionType\\n      reference\\n      syllabusContentIdList\\n      syllabusId\\n      userId\\n      understandingLevelId\\n      categoryIdList\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}'
      )

      formData.append("map", '{"1":["variables.file"]}')
      formData.append("1", http.file(file, "bulk.xlsx"))

      //bulk-validte
      const response = http.post(
        "https://api-devtestpaper.innovatetech.io/graphql",
        formData.body(),
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: token,
            "cache-control": "no-cache",
            "content-type":
              "multipart/form-data; boundary=" + formData.boundary,
            origin: "https://devtestpaper-backoffice.innovatetech.io",
            pragma: "no-cache",
            priority: "u=1, i",
            referer: "https://devtestpaper-backoffice.innovatetech.io/",
            "sec-ch-ua":
              '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            traceparent:
              "00-ef29f2fd08f661e7f3985c7459dbf848-3b39fbc4ebfb7b59-01",
            "user-agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          },
        }
      )

      // Check the response
      check(response, {
        "File upload successful": (res) => res.status === 200,
      })

      //bulk uplaod
      const formDataUpload = new FormData()
      formDataUpload.boundary = "----WebKitFormBoundaryBL36C9EWTsPve1Zl"

      formDataUpload.append(
        "operations",
        '{"operationName":"BulkInsertQuestions","variables":{"file":null,"bucketId":"3dfdb8df-1985-4a24-bd2b-21361feca072","syllabusId":"b7788e0d-87e7-468b-b6db-112c1251dec6"},"query":"mutation BulkInsertQuestions($file: Upload!, $bucketId: String!, $syllabusId: String!) {\n  bulkInsertQuestions(file: $file, bucketId: $bucketId, syllabusId: $syllabusId) {\n    bulkUploadId\n    __typename\n  }\n}\n"}'
      )

      formData.append("map", '{"1":["variables.file"]}')
      formData.append("1", http.file(file, "bulk.xlsx"))

      //bulk-validte
      response = http.post(
        "https://api-devtestpaper.innovatetech.io/graphql",
        formData.body(),
        {
          headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            authorization: token,
            "cache-control": "no-cache",
            "content-type":
              "multipart/form-data; boundary=" + formData.boundary,
            origin: "https://devtestpaper-backoffice.innovatetech.io",
            pragma: "no-cache",
            priority: "u=1, i",
            referer: "https://devtestpaper-backoffice.innovatetech.io/",
            "sec-ch-ua":
              '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            traceparent:
              "00-ef29f2fd08f661e7f3985c7459dbf848-3b39fbc4ebfb7b59-01",
            "user-agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
          },
        }
      )

      const bulkImportId = JSON.parse(response.body).data.bulkInsertQuestions
        .bulkUploadId

      pollForCompletion(token, bulkImportId, "bulkImport", bulkImportTrend)

      sleep(1)
    } else {
      console.error("Login failed")
    }
  })
}
