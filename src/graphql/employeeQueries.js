import { gql } from '@apollo/client';

// ─── Employee Queries ─────────────────────────────────────────────────────────

export const GET_EMPLOYEES = gql`
  query GetEmployees($first: Int!, $search: String, $after: String) {
    employees(first: $first, search: $search, after: $after) {
      employees {
        id
        employeeId
        roleName
        isActive
        user {
          id
          firstName
          lastName
          email
          phone
        }
      }
      hasMore
      nextCursor
    }
  }
`;

// ─── Permission Queries ───────────────────────────────────────────────────────

export const GET_EMPLOYEE_PERMISSIONS = gql`
  query GetEmployeePermissions($employeeId: Int!) {
    employeePermissions(employeeId: $employeeId) {
      id
      module
      access
    }
  }
`;



// import { gql } from '@apollo/client';

// export const GET_EMPLOYEES = gql`
//   query GetEmployees($first: Int!, $search: String, $after: String) {
//     employees(first: $first, search: $search, after: $after) {
//       employees {
//         id
//         employeeId
//         roleName
//         isActive
//         user {
//           id
//           firstName
//           lastName
//           email
//           phone
//         }
//       }
//       hasMore
//       nextCursor
//     }
//   }
// `;

// export const GET_EMPLOYEE_PERMISSIONS = gql`
//   query GetEmployeePermissions($employeeId: Int!) {
//     employeePermissions(employeeId: $employeeId) {
//       id
//       module
//       access
//     }
//   }
// `;

// // Fetch the Employee record that belongs to the currently logged-in user.
// // Called once after login when role === 'employee'.
// export const GET_MY_EMPLOYEE_PROFILE = gql`
//   query GetMyEmployeeProfile {
//     myEmployeeProfile {
//       id
//     }
//   }
// `;