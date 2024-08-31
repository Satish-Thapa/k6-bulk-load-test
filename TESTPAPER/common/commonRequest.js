import http from "k6/http"
import { checkSucessStatusCode } from "../utils/utlis.js"

export const execCommonRequest = (token) => {
  let response
  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getCourses","variables":{},"query":"query getCourses {\\n  getCourses {\\n    coursesList {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getBucketsByCourseId","variables":{"id":"6f676401-7ba6-4c94-b807-6d1de4f11770"},"query":"query getBucketsByCourseId($id: String!) {\\n  getBucketsByCourseId(id: $id) {\\n    bucketsList {\\n      id\\n      name\\n      description\\n      questionsCount\\n      remarks\\n      tagsList\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getCourseById","variables":{"id":"6f676401-7ba6-4c94-b807-6d1de4f11770"},"query":"query getCourseById($id: String!) {\\n  getCourseById(id: $id) {\\n    id\\n    name\\n    syllabusesList {\\n      id\\n      title\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getCourses","variables":{},"query":"query getCourses {\\n  getCourses {\\n    coursesList {\\n      id\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getQuestionTypes","variables":{},"query":"query getQuestionTypes($autoGradedOnly: Boolean) {\\n  getQuestionTypes(autoGradedOnly: $autoGradedOnly) {\\n    questionTypeList {\\n      id\\n      name\\n      hasOptions\\n      hasMultipleAnswers\\n      hasSubQuestions\\n      maxOptionsCount\\n      position\\n      isAutoGraded\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )
  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getDifficulties","variables":{},"query":"query getDifficulties {\\n  getDifficulties {\\n    difficultyList {\\n      id\\n      name\\n      position\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )
  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getUnderstandingLevel","variables":{},"query":"query getUnderstandingLevel {\\n  getUnderstandingLevel {\\n    understandingLevelList {\\n      id\\n      name\\n      remarks\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getBucketById","variables":{"id":"592d0207-a297-40fc-85a2-2c5fc0f6ab24"},"query":"query getBucketById($id: String!) {\\n  getBucketById(id: $id) {\\n    id\\n    name\\n    description\\n    tagsList\\n    course {\\n      id\\n      name\\n      code\\n      description\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )
  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getQuestionsByBucketId","variables":{"id":"592d0207-a297-40fc-85a2-2c5fc0f6ab24","page":1,"perPage":10,"query":"","difficultyIds":[],"questionTypeIds":[],"syllabusContentIds":[],"understandingIds":[]},"query":"query getQuestionsByBucketId($id: String!, $page: Int!, $perPage: Int!, $query: String, $difficultyIds: [String], $questionTypeIds: [String], $syllabusContentIds: [String], $understandingIds: [String], $categoryIds: [String]) {\\n  getQuestionsByBucketId(id: $id, page: $page, perPage: $perPage, query: $query, difficultyIds: $difficultyIds, questionTypeIds: $questionTypeIds, syllabusContentIds: $syllabusContentIds, understandingLevelIds: $understandingIds, categoryIdList: $categoryIds) {\\n    questionsList {\\n      id\\n      question\\n      questionText\\n      difficulty\\n      questionType\\n      reference\\n      marks\\n      syllabusContentsList {\\n        id\\n        topicNo\\n        topic {\\n          id\\n          name\\n          __typename\\n        }\\n        __typename\\n      }\\n      understandingLevelId\\n      categoryIdList\\n      __typename\\n    }\\n    totalPageCount\\n    totalQuestionCount\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )

  checkSucessStatusCode(response)

  response = http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    '{"operationName":"getSyllabusById","variables":{"id":"24e9fa2d-c008-4d2a-8cfd-9a285be82f5e"},"query":"query getSyllabusById($id: String!) {\\n  getSyllabusById(id: $id) {\\n    id\\n    title\\n    syllabusContentsList {\\n      id\\n      topicNo\\n      topic {\\n        id\\n        name\\n        description\\n        __typename\\n      }\\n      syllabusContentsList {\\n        id\\n        topicNo\\n        topic {\\n          id\\n          name\\n          description\\n          __typename\\n        }\\n        syllabusContentsList {\\n          id\\n          topicNo\\n          topic {\\n            id\\n            name\\n            description\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  )
  checkSucessStatusCode(response)
}

export const login = (username, password) =>
  http.post(
    "https://api-devtestpaper.innovatetech.io/graphql",
    `{"operationName":"Login","variables":{"email":"${username}","password":"${password}"},"query":"mutation Login($email: String!, $password: String!) {\\n  login(email: $email, password: $password) {\\n    token\\n    isMfaLocked\\n    user {\\n      id\\n      email\\n      name\\n      avatar\\n      isMfaEnabled\\n      role {\\n        id\\n        name\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  )
