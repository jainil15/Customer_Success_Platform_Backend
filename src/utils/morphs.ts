import { UserRole } from "@prisma/client";


// const addClient = async (body: AddClientType) => {
//   const project = prisma.project.update({
//     where: {
//       id: String(body.projectId),
//     },
//     data: {
//       clients: {
//         create: body.clients.map((client) => ({
//           client: {
//             connectOrCreate: {
//               where: {
//                 email: client.email,
//               },
//               create: {
//                 role: UserRole.CLIENT,
//                 name: client.name,
//                 email: client.email,
//               },
//             },
//           },
//         })) as any,
//       },
//     },
//   });
//   return project;
// };