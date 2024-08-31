import http from "k6/http"
import { checkBulkStatus } from "../utils/utlis.js"
import { sleep } from "k6"

export const pollForCompletion = (token, bulkId, type, trend) => {
  const exportStartTime = Date.now()
  let isCompleted = false
  const maxRetries = 10
  let retryCount = 0

  while (!isCompleted && retryCount < maxRetries) {
    const response =
      type === "bulkExport"
        ? http.post(
            "https://api-devtestpaper.innovatetech.io/graphql",
            `{"operationName":"Query","variables":{"uploadId":"${bulkId}"},"query":"query Query($uploadId: String!) {\\n  getBulk${
              type === "bulkExport" ? "Export" : "Import"
            }Status(uploadId: $uploadId) {\\n    status\\n    filePath\\n    error\\n    __typename\\n  }\\n}\\n"}`,
            {
              headers: {
                authorization: token,
                "content-type": "application/json",
              },
            }
          )
        : http.post()

    const statusResponse = JSON.parse(response.body).data[
      `getBulk${type === "bulkExport" ? "Export" : "Import"}Status`
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
