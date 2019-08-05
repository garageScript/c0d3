const { makeExecutableSchema, mergeSchemas } = require('graphql-tools')

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
    id: String
    username: String
    name: String
    email: String
    userLesson: UserLesson
    online: Boolean
    lastroomId: Int
    isAdmin: Boolean
  }
`

module.exports = mergeSchemas({
  schemas: [curriculumSchema, linkTypeDefs]
})
