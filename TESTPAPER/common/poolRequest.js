import http from "k6/http"
import { checkBulkStatus } from "../utils/utlis.js"
import { sleep } from "k6"

export const pollForCompletion = (token, bulkId, type, trend) => {
  const exportStartTime = Date.now()
  let isCompleted = false
  const maxRetries = 10
  let retryCount = 0

  sleep(5) //wait 5 sec before polling
  while (!isCompleted && retryCount < maxRetries) {
    console.log(`Retry count ${retryCount} for bulkId:${bulkId}`)
    console.log(type)
    const response =
      type === "bulkExport"
        ? http.post(
            "https://api-devtestpaper.innovatetech.io/graphql",
            `{"operationName":"Query","variables":{"uploadId":"${bulkId}"},"query":"query Query($uploadId: String!) {\\n  getBulkExportStatus(uploadId: $uploadId) {\\n    status\\n    filePath\\n    error\\n    __typename\\n  }\\n}\\n"}`,
            {
              headers: {
                authorization: token,
                "content-type": "application/json",
              },
            }
          )
        : http.post(
            "https://api-devtestpaper.innovatetech.io/graphql",
            `{"operationName":"GetBulkQuestionsUploadStatus","variables":{"uploadId":"${bulkId}"},"query":"query GetBulkQuestionsUploadStatus($uploadId: String!) {\\n  getBulkQuestionsUploadStatus(uploadId: $uploadId) {\\n    status\\n    insertedData {\\n      answersList {\\n        answer\\n        blankId\\n        guidance\\n        isCorrect\\n        label\\n        answerText\\n        marks\\n        order\\n        remarks\\n        __typename\\n      }\\n      bucketId\\n      isFitb\\n      clientId\\n      difficulty\\n      errors\\n      hasMultipleAnswers\\n      mcqOptionsCount\\n      hasOptions\\n      hasSubQuestions\\n      isAutoGraded\\n      isCustomEnabled\\n      isValid\\n      marks\\n      maxOptionsCount\\n      optionsList {\\n        answer\\n        blankId\\n        guidance\\n        isCorrect\\n        label\\n        marks\\n        order\\n        remarks\\n        __typename\\n      }\\n      question\\n      questionsList {\\n        questionText\\n        questionsList {\\n          questionText\\n          questionType\\n          reference\\n          syllabusContentIdList\\n          syllabusId\\n          userId\\n          answersList {\\n            answer\\n            blankId\\n            guidance\\n            isCorrect\\n            label\\n            answerText\\n            marks\\n            order\\n            remarks\\n            __typename\\n          }\\n          bucketId\\n          isFitb\\n          clientId\\n          difficulty\\n          errors\\n          hasMultipleAnswers\\n          mcqOptionsCount\\n          hasOptions\\n          hasSubQuestions\\n          isAutoGraded\\n          isCustomEnabled\\n          isValid\\n          marks\\n          maxOptionsCount\\n          optionsList {\\n            answer\\n            blankId\\n            guidance\\n            isCorrect\\n            label\\n            marks\\n            order\\n            remarks\\n            __typename\\n          }\\n          question\\n          __typename\\n        }\\n        questionType\\n        reference\\n        syllabusContentIdList\\n        syllabusId\\n        userId\\n        answersList {\\n          answer\\n          blankId\\n          guidance\\n          isCorrect\\n          label\\n          answerText\\n          marks\\n          order\\n          remarks\\n          __typename\\n        }\\n        bucketId\\n        isFitb\\n        clientId\\n        difficulty\\n        errors\\n        hasMultipleAnswers\\n        mcqOptionsCount\\n        hasOptions\\n        hasSubQuestions\\n        isAutoGraded\\n        isCustomEnabled\\n        isValid\\n        marks\\n        maxOptionsCount\\n        optionsList {\\n          answer\\n          blankId\\n          guidance\\n          isCorrect\\n          label\\n          marks\\n          order\\n          remarks\\n          __typename\\n        }\\n        question\\n        __typename\\n      }\\n      questionText\\n      questionType\\n      reference\\n      syllabusContentIdList\\n      syllabusId\\n      userId\\n      __typename\\n    }\\n    error\\n    __typename\\n  }\\n}\\n"}`,
            {
              headers: {
                authorization: token,
                "content-type": "application/json",
              },
            }
          )

    {
    }

    const statusResponse = JSON.parse(response.body).data[
      `getBulk${type === "bulkExport" ? "Export" : "QuestionsUpload"}Status`
    ]
    const status = statusResponse.status

    if (status === "Completed") {
      console.log(
        type == "bulkExport"
          ? `Export is ready. File can be downloaded from: ${statusResponse.filePath}${bulkId}`
          : `Bulk import complete for ${bulkId}`
      )

      //calculate end time
      const exportEndTime = Date.now()
      const totalExportTime = exportEndTime - exportStartTime
      trend.add(totalExportTime)
      checkBulkStatus(status)
      isCompleted = true
    } else if (status === "Error") {
      console.error(
        `${type}  failed with error: ${statusResponse.error}${bulkId}`
      )
      const exportEndTime = Date.now()
      const totalExportTime = exportEndTime - exportStartTime
      trend.add(totalExportTime)
      checkBulkStatus(status)
      isCompleted = true
    } else {
      console.log(
        `${type}  status: ${status}. Retrying in 3 seconds...${bulkId}`
      )
      retryCount++
      sleep(3)
    }
  }

  if (!isCompleted) {
    console.error(
      `${type}  did not complete within the expected time. ${bulkId}`
    )
  }
}
