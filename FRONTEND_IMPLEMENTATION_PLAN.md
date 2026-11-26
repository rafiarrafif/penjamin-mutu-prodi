# Frontend Implementation Guide

This guide explains how to build the frontend by using the backend as the source of truth. Follow the steps in order. Backend endpoints, payload names, enums, validation limits, HTTP statuses, and role requirements must match the backend implementation.

## 1. Separate Backend and Frontend Ports

The backend and frontend should run on different ports during development.

The backend currently uses port `3000`, while the frontend package also has a development command targeting port `3000`.

### Actions

1. Keep the backend on port `3000`.
2. Change the frontend development script in `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "vite dev --port 5173"
  }
}
```

3. Start the backend:

```bash
cd backend
bun run dev
```

4. Start the frontend:

```bash
cd frontend
bun run dev
```

The development addresses should be:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Do not start both applications on the same port.

## 2. Configure Environment Variables

Create `frontend/.env.local`:

```text
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
```

Create `frontend/.env.example`:

```text
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
```

Add `.env.local` to `.gitignore` if it is not already ignored.

Do not place JWT secrets or Google OAuth secrets in frontend environment variables.

## 3. Configure Backend CORS

Allow requests from `http://localhost:5173` in the backend.

Configure the backend to allow:

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`
- `Authorization` header
- `Content-Type` header

For production, replace the frontend origin with the deployed frontend URL.

Do not use an unrestricted origin if credentials or authorization are involved.

## 4. Create the Frontend Folder Structure

Create this structure under `frontend/src`:

```text
src/
  api/
    client.ts
    auth.api.ts
    account.api.ts
    session.api.ts
    department.api.ts
    document.api.ts
    types.ts
  auth/
    auth-context.tsx
    auth-storage.ts
    auth-types.ts
    role.ts
  components/
    layout/
      app-shell.tsx
      sidebar.tsx
      topbar.tsx
    ui/
      button.tsx
      card.tsx
      dialog.tsx
      form-field.tsx
      select-field.tsx
      toast.tsx
    guards/
      require-auth.tsx
      require-role.tsx
  routes/
    login.tsx
    oauth/
      callback.tsx
    dashboard.tsx
    profile.tsx
    admin/
      accounts.tsx
      departments.tsx
      categories.tsx
    director/
      provisions.tsx
```

Keep API communication separate from React components. Components should call API modules instead of directly executing fetch requests.

## 5. Create Shared API Types

Create `frontend/src/api/types.ts`.

Use types that match the backend response format:

```ts
interface ApiMessage {
  title: string
  description: string
}

interface SuccessResponse<T = unknown> {
  success: true
  status: number
  message: ApiMessage
  data?: T[]
}

interface ErrorResponse {
  success: false
  status: number
  message: ApiMessage
  errors: unknown[]
}
```

Create a frontend API exception type containing:

- HTTP status
- Response title
- Response description
- Backend `errors` array

Map field errors to form fields where possible. Show general errors using a toast or alert.

## 6. Create the API Client

Create `frontend/src/api/client.ts`.

The client should:

1. Read `VITE_API_URL`.
2. Accept a relative API path such as `/accounts/`.
3. Read the JWT from auth storage.
4. Add the authorization header for protected endpoints:

```text
Authorization: Bearer <token>
```

5. Add `Content-Type: application/json` for JSON requests.
6. Send request bodies as JSON.
7. Parse the backend JSON response.
8. Throw a typed API error when `success` is false or the HTTP status indicates failure.

Do not trust `response.ok` alone. The backend also provides an explicit `success` property.

For unauthenticated endpoints, do not add the bearer token. For protected endpoints, add the stored bearer token.

## 7. Create Endpoint Modules

Create separate modules for backend routes.

### Authentication API

Create `frontend/src/api/auth.api.ts`.

Implement:

- `requestGoogleAuthorization()`
- `completeGoogleAuthorization(code, state)`

Backend calls:

```text
POST /accounts/auth/request/google
GET /accounts/auth/callback/google
```

The Google callback result contains the JWT as:

```text
data[0].token
```

### Account API

Create `frontend/src/api/account.api.ts`.

Implement:

- `createAccount`
- `approveProvision`
- `editFromAdmin`
- `deleteFromAdmin`
- `editSelf`

Backend calls:

```text
POST /accounts/
POST /accounts/approvalprovision
POST /accounts/editfromadmin
POST /accounts/deletefromadmin
POST /accounts/selfedit
```

### Session API

Create `frontend/src/api/session.api.ts`.

Implement:

- `revokeCurrentSession`

Backend call:

```text
POST /sessions/revokecurrent
```

Request body:

```text
operationType: "UPDATE"
```

### Department API

Create `frontend/src/api/department.api.ts`.

Implement:

- `createDepartment`

Backend call:

```text
POST /departments/
```

### Document API

Create `frontend/src/api/document.api.ts`.

Implement:

- `createCategory`

Backend call:

```text
POST /documents/categories/
```

## 8. Implement Authentication Storage

Create `frontend/src/auth/auth-storage.ts`.

Initially, store the JWT in `localStorage` with a key such as:

```text
auth_token
```

Implement:

- `getToken()`
- `setToken(token)`
- `clearToken()`

Do not store passwords or Google OAuth secrets.

The JWT can contain:

- `session_id`
- `account.id`
- `account.fullname`
- `account.email`
- `account.role`
- `account.profilePicture`
- `account.isVerified`

The frontend may decode the JWT payload for display. Client-side decoding does not verify a JWT. The backend must always verify bearer tokens.

On application startup:

1. Read the token.
2. Decode the payload.
3. Check expiration locally.
4. Verify required account fields exist.
5. Populate auth context.
6. Clear invalid or malformed tokens.

## 9. Define Roles and Permissions

Create `frontend/src/auth/role.ts`.

Use the backend hierarchy:

```text
lecturer: 0
verificator/verifier: 1
admin: 2
director: 3
```

Implement:

- `getRoleLevel(role)`
- `hasMinimumRole(actualRole, requiredRole)`
- `canManageAccounts()`
- `canApproveProvision()`
- `canManageDepartments()`
- `canManageCategories()`

Match frontend route guards to backend authorization:

- Profile editing: lecturer or higher
- Account management: admin or higher
- Department management: admin or higher
- Document categories: admin or higher
- Account approval: director

Frontend route guards improve usability but never replace backend authorization.

## 10. Create the Auth Context

Create `frontend/src/auth/auth-context.tsx`.

The context should expose:

- `token`
- `account`
- `role`
- `isAuthenticated`
- `isLoading`
- `loginWithToken(token)`
- `logout()`

### Startup

1. Set `isLoading` to `true`.
2. Restore the JWT.
3. Decode and validate the account data.
4. Set auth state.
5. Set `isLoading` to `false`.

### Logout

1. Call `POST /sessions/revokecurrent`.
2. Clear the JWT from local storage.
3. Clear auth context state.
4. Navigate to `/login`.

If revocation fails, clear the local token anyway so that the frontend does not present an invalid session as authenticated.

## 11. Implement the Google OAuth Flow

### Login Page

Create `frontend/src/routes/login.tsx`.

The login page should:

- Render a Google login button.
- Call `POST /accounts/auth/request/google`.
- Read `authorizationUrl` from `data[0].authorizationUrl`.
- Redirect the browser to that URL.
- Show loading, provider, and backend errors.

Do not construct the Google authorization URL manually.

### OAuth Callback Page

Create `frontend/src/routes/oauth/callback.tsx`.

On page load:

1. Read `code`, `state`, and `error` from the browser URL.
2. If `error` exists, show an authorization-denied state.
3. If `code` or `state` is missing, show an invalid callback state.
4. Call `GET /accounts/auth/callback/google`.
5. Read the JWT from `data[0].token`.
6. Store the token.
7. Populate auth context.
8. Navigate to `/dashboard`.

## 12. Create Route Guards

Create `frontend/src/components/guards/require-auth.tsx`.

A protected route should:

- Wait until auth initialization finishes.
- Redirect logged-out users to `/login`.
- Render the page for authenticated users.

Create `frontend/src/components/guards/require-role.tsx`.

A role-protected route should:

- First require authentication.
- Compare the account role with the required role.
- Render an access-denied page or redirect to `/dashboard`.

Apply guards to:

- `/dashboard`
- `/profile`
- `/admin/*`
- `/director/*`

## 13. Create the Application Layout

Create `frontend/src/components/layout/app-shell.tsx`.

The shell should contain:

- Sidebar
- Top bar
- Authenticated account name
- Account profile picture
- Role label
- Logout button
- Mobile navigation

Sidebar items should be role-aware:

- Dashboard: all authenticated users
- Profile: all authenticated users
- Accounts: admin and director
- Departments: admin and director
- Categories: admin and director
- Provision approval: director

Hide unauthorized navigation items instead of only disabling them.

## 14. Build the Dashboard

Create `frontend/src/routes/dashboard.tsx`.

The dashboard cannot display real account, department, or category data until corresponding GET endpoints exist.

It can initially show:

- Signed-in account information
- Role
- Verification status
- Available actions
- Role-appropriate navigation cards

Do not create fabricated activity, metrics, or tables.

## 15. Build the Profile Page

Create `frontend/src/routes/profile.tsx`.

Call:

```text
POST /accounts/selfedit
```

Supported fields:

- `email`
- `fullname`
- `role`
- `sex`
- `phone_no`
- `address`

Frontend validation should match the backend:

- Email: valid email and maximum 255 characters
- Fullname: minimum 1 and maximum 255 characters
- Role: `director`, `admin`, `verificator`, or `lecturer`
- Sex: maximum 6 characters
- Phone number: maximum 15 characters
- Address: maximum 255 characters

The backend currently accepts `role` in this endpoint. Confirm whether users should be allowed to change their role before exposing it in the UI.

## 16. Build Account Management

Create `frontend/src/routes/admin/accounts.tsx`.

Initially implement:

- Account creation form
- Account editing form
- Account deletion confirmation

Build a data table only after the backend provides an account list endpoint.

### Account Creation

Send:

```json
{
  "operationType": "CREATE",
  "fullname": "Example Name",
  "email": "example@example.com",
  "role": "lecturer",
  "sex": "male",
  "phone_no": "123456789",
  "address": "Optional address"
}
```

`phone_no` and `address` are optional.

Allowed roles:

- `director`
- `admin`
- `verificator`
- `lecturer`

Allowed sex values:

- `male`
- `female`

After a `201` response:

1. Show the backend success message.
2. Close or reset the form.
3. Refresh account data if a list endpoint is available.

### Account Editing

Send:

```json
{
  "operationType": "UPDATE",
  "account_id": "account-id",
  "email": "new@example.com",
  "fullname": "New Name"
}
```

Fields other than `account_id` are optional. Only changed fields should normally be sent.

### Account Deletion

Send:

```json
{
  "operationType": "DELETE",
  "email": "example@example.com"
}
```

Open a confirmation dialog before deletion because the operation soft-deletes the account.

## 17. Build Provision Approval

Create `frontend/src/routes/director/provisions.tsx`.

Send:

```json
{
  "operationType": "UPDATE",
  "email": "example@example.com"
}
```

Display separate success states:

- Account approved
- Account already verified

The backend can return:

- `200` for a newly approved account
- `201` for an account that was already verified

## 18. Build Department Management

Create `frontend/src/routes/admin/departments.tsx`.

Create form fields:

- Name: required, maximum 115 characters
- Description: optional, maximum 255 characters

Payload:

```json
{
  "operationType": "CREATE",
  "name": "Department Name",
  "description": "Department description"
}
```

After `201`:

1. Show the backend success message.
2. Reset the form.
3. Refresh department data when a GET endpoint exists.

## 19. Build Data Category Management

Create `frontend/src/routes/admin/categories.tsx`.

Create form fields:

- Name: required, maximum 250 characters

Payload:

```json
{
  "operationType": "CREATE",
  "name": "Category Name"
}
```

After `201`:

1. Show the backend success message.
2. Reset the form.
3. Refresh category data when a GET endpoint exists.

## 20. Build Shared Form Components

Create reusable components:

- Text input
- Email input
- Textarea
- Select
- Form label
- Field error
- Submit button
- Loading button
- Confirmation dialog
- Toast notification

Every component should support:

- Disabled state
- Loading state
- Maximum length
- Required state
- Accessible labels
- Accessible error descriptions

Do not rely only on color to communicate success or errors.

## 21. Handle Backend Errors Consistently

For every API failure:

1. Read `status`.
2. Read `message.title`.
3. Read `message.description`.
4. Read `errors`.
5. Map field errors to forms.
6. Show general errors in a toast or alert.

Expected status patterns:

- `400`: invalid request or OAuth callback
- `401`: missing, invalid, or revoked JWT
- `403`: authenticated but insufficient role
- `404`: resource not found
- `409`: duplicate or conflicting data
- `502`: external provider or service failure
- `500`: backend internal failure

For `401` on protected routes:

1. Clear frontend auth state.
2. Clear local token storage.
3. Redirect to `/login`.

For `403`:

- Show an access-denied message.
- Do not clear the authentication session.

## 22. Add Missing Backend Read APIs

The backend currently provides mutation operations but not enough read operations for complete dashboards.

Create these backend endpoints before building full management tables:

```text
GET /accounts/me
GET /accounts
GET /accounts/:id
GET /accounts/unverified
GET /departments
GET /departments/:id
GET /documents/categories
GET /documents/categories/:id
```

The exact route names should follow the backend naming style.

Every endpoint should use the standard backend response format:

```text
success
status
message
data
```

Do not maintain fake local account or department data in the frontend.

## 23. Add a Current-Account Endpoint

Create:

```text
GET /accounts/me
```

It should return live account details, including:

- ID
- Full name
- Email
- Profile picture
- Role
- Sex
- Phone number
- Address
- Verification status

This endpoint allows:

- Profile pages to load fresh data
- Database role changes to appear in the frontend
- Deleted accounts to be detected
- A central session and account status check

## 24. Add Session Status Handling

Recommended endpoint:

```text
GET /sessions/current
```

This endpoint should return:

- Current account
- Active session information
- Session status

Alternatively, expand `GET /accounts/me` so it verifies the current active session.

Until a session-status endpoint exists:

- JWT payload data can be used for display.
- Protected API calls detect revoked sessions through `401` responses.

## 25. Implement Loading and Empty States

Every API page needs:

- Initial loading state
- API error state
- Empty state
- Retry action
- Success notification
- Unauthorized state

Examples:

- No accounts found
- No departments found
- No categories found
- No unverified accounts found
- Session expired

## 26. Update Styling

The project already uses Tailwind CSS.

Create a consistent visual system:

- Page container
- Page title
- Section headings
- Card borders
- Muted text
- Primary, danger, and neutral buttons
- Responsive table or card layout
- Mobile sidebar behavior

Suggested screens:

- Login card
- Dashboard summary
- Sidebar navigation
- Account table
- Account form
- Department cards
- Category cards
- Provision approval table

## 27. Add Tests

### API Tests

Test:

- Missing token returns `401`
- Invalid token returns `401`
- Lecturer accessing an admin route receives `403`
- Admin can create accounts
- Admin cannot approve provisions
- Director can approve provisions
- Revoked session receives `401`

### Frontend Tests

Test:

- Logged-out users cannot open protected routes
- Admin links are hidden from lecturers
- Director links are hidden from admins
- OAuth callback stores the returned token
- Missing callback parameters show an error
- Logout clears local auth
- Backend field errors appear beside fields
- Backend title and description appear in notifications

Test route and form edge cases rather than only the happy path.

## 28. Run Final Validation

Run:

```bash
cd frontend
bun run lint
bun run build
```

Verify:

- Frontend and backend communicate correctly.
- CORS is configured for the frontend origin.
- Every request path matches the backend exactly.
- Every payload includes the required `operationType`.
- Email and text limits match backend Zod schemas.
- Role values match backend enums.
- Protected requests include bearer tokens.
- Logout revokes the current session.
- `401` and `403` responses are handled differently.
- OAuth callback succeeds in a browser.

## Recommended Implementation Order

1. Environment configuration and CORS
2. API client and response types
3. Authentication storage and auth context
4. Login and OAuth callback
5. Route guards and application shell
6. Dashboard and profile
7. Session logout
8. Backend read endpoints
9. Account management
10. Provision approval
11. Department management
12. Category management
13. Testing and visual cleanup

The frontend must never define a data contract that contradicts the backend. Endpoint paths, payload names, enums, maximum lengths, statuses, and role requirements should originate from the backend implementation and documentation.
