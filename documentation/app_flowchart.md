flowchart TD
    A[User visits App] --> B{Logged In}
    B -->|No| C[Redirect to Sign In]
    C --> D[Sign In Page]
    D --> B
    B -->|Yes| E[Dashboard]
    E --> F[Select Template]
    F --> G[Template Configuration Form]
    G --> H[Submit Generation Request]
    H --> I[API Route generate]
    I --> J[Validate and Authenticate]
    J --> K[Add Job to Queue]
    K --> L[Background Worker]
    L --> M[Fetch Template from DB]
    M --> N[Generate Code]
    N --> O[Push Code to GitHub]
    O --> P[Update Job Status]
    P --> Q[Notify User on Frontend]