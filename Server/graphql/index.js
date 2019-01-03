const { makeExecutableSchema, mergeSchemas } = require('graphql-tools')

// Schema for chat
const chatTypeDefs = require('../chat/graphql/typeDefs')
const chatQueries = require('../chat/graphql/queries')
const chatMutations = require('../chat/graphql/mutations')
const chatResolvers = {
  Query: chatQueries,
  Mutation: chatMutations
}
const chatSchema = makeExecutableSchema({
  typeDefs: chatTypeDefs,
  resolvers: chatResolvers
})

// Schema for curriculum
const curriculumTypeDefs = require('./typedefs')
const curriculumQueries = require('./queries')
const curriculumMutations = require('./mutations')
const curriculumResolvers = {
  Query: curriculumQueries,
  Mutation: curriculumMutations
}
const curriculumSchema = makeExecutableSchema({
  typeDefs: curriculumTypeDefs,
  resolvers: curriculumResolvers
})

const linkTypeDefs = `
  type User {
    id: Int,
    username: String,
    name: String,
    userLesson: UserLesson,
    online: Boolean,
    lastroomId: Int
  }
`

module.exports = mergeSchemas({
  schemas: [curriculumSchema, chatSchema, linkTypeDefs]
})
