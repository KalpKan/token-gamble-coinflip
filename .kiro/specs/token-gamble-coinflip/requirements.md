# Requirements Document

## Introduction

Token Gamble is a hackathon project that gamifies OpenAI API usage through a coinflip-based wagering system. Users load prompts they want answered, create or join coinflips with specific response depth levels (short/medium/long), and the winner gets their prompt answered using the loser's OpenAI API key. The system features smooth animations, real-time multiplayer functionality, and a polished gambling-style interface inspired by sites like CSGO Roll.

## Glossary

- **Token Gamble System**: The web application that enables users to wager API usage through coinflips
- **User**: A person with an account who can load prompts, create coinflips, and join coinflips
- **Prompt**: A question or instruction that a user wants answered by OpenAI's API
- **Loaded Prompt**: A prompt that has been saved to the user's profile but not yet answered
- **Settled Prompt**: A prompt that has been answered through a won coinflip and is stored in history
- **Response Depth**: The length category for API responses (short, medium, or long)
- **Coinflip**: A wagering match between two users where the winner gets their prompt answered using the loser's API key
- **Coinflip Creator**: The user who initiates a coinflip and chooses their coin side
- **Coinflip Joiner**: The user who joins an existing coinflip and is assigned the opposite coin side
- **Lobby**: The public area where users can view all open coinflips and create new ones
- **Open Coinflip**: A coinflip that has been created but is waiting for an opponent to join
- **Active Coinflip**: A coinflip that has two participants and is currently flipping
- **Supabase**: The backend service used for user authentication, data storage, and real-time updates
- **OpenAI API Key**: The authentication credential users provide to enable API calls on their behalf

## Requirements

### Requirement 1: User Authentication and Profile Management

**User Story:** As a user, I want to create an account and manage my profile, so that I can securely store my API key and access my prompts across sessions.

#### Acceptance Criteria

1. WHEN a new visitor accesses the Token Gamble System, THE Token Gamble System SHALL display options to sign up or log in
2. WHEN a user completes the sign-up process, THE Token Gamble System SHALL create a new user account in Supabase
3. WHEN a user logs in successfully, THE Token Gamble System SHALL redirect the user to the main application interface
4. WHEN a user navigates to their profile settings, THE Token Gamble System SHALL display a field to enter or update their OpenAI API key
5. WHEN a user saves their OpenAI API key, THE Token Gamble System SHALL store the key in Supabase associated with their user profile

### Requirement 2: Prompt Loading and Management

**User Story:** As a user, I want to load multiple prompts and manage them, so that I can prepare questions I want answered and organize them efficiently.

#### Acceptance Criteria

1. WHEN a user navigates to the prompt management interface, THE Token Gamble System SHALL display a form to add new prompts
2. WHEN a user submits a new prompt, THE Token Gamble System SHALL save the prompt to their profile in Supabase
3. WHEN a user views their prompt list, THE Token Gamble System SHALL display all loaded prompts that have not been answered
4. WHEN a user selects a loaded prompt, THE Token Gamble System SHALL provide options to edit or delete that prompt
5. WHEN a user edits a loaded prompt, THE Token Gamble System SHALL update the prompt text in Supabase
6. WHEN a user deletes a loaded prompt, THE Token Gamble System SHALL remove the prompt from Supabase
7. WHEN a prompt has been answered through a won coinflip, THE Token Gamble System SHALL prevent editing or deletion of that prompt
8. WHEN a prompt has been answered through a won coinflip, THE Token Gamble System SHALL move the prompt and its answer to a settled tab

### Requirement 3: Settled Prompts History

**User Story:** As a user, I want to view all prompts I've won and their answers, so that I can access the responses I've earned through coinflips.

#### Acceptance Criteria

1. WHEN a user navigates to the settled tab, THE Token Gamble System SHALL display all prompts the user has won through coinflips
2. WHEN a user views a settled prompt, THE Token Gamble System SHALL display the original prompt text, response depth, and the API response
3. WHEN a user views the settled tab, THE Token Gamble System SHALL organize prompts in chronological order with most recent first

### Requirement 4: Coinflip Creation

**User Story:** As a user, I want to create a coinflip with my chosen parameters, so that I can wager my API usage against another user.

#### Acceptance Criteria

1. WHEN a user initiates coinflip creation, THE Token Gamble System SHALL display a list of the user's loaded prompts to choose from
2. WHEN a user selects a prompt for the coinflip, THE Token Gamble System SHALL display options to choose response depth (short, medium, or long)
3. WHEN a user selects a response depth, THE Token Gamble System SHALL display options to choose their coin side (heads or tails)
4. WHEN a user confirms coinflip creation, THE Token Gamble System SHALL create a new open coinflip record in Supabase
5. WHEN a coinflip is created, THE Token Gamble System SHALL mark the selected prompt as locked for that coinflip
6. WHEN a coinflip is created, THE Token Gamble System SHALL broadcast the new coinflip to all connected users via Supabase real-time

### Requirement 5: Lobby Display and Real-Time Updates

**User Story:** As a user, I want to see all available coinflips in a public lobby, so that I can find matches that interest me and join them.

#### Acceptance Criteria

1. WHEN a user navigates to the lobby, THE Token Gamble System SHALL display all open coinflips
2. WHEN a user views an open coinflip in the lobby, THE Token Gamble System SHALL display the response depth and the creator's chosen coin side
3. WHEN a new coinflip is created by any user, THE Token Gamble System SHALL immediately update the lobby display for all connected users
4. WHEN a coinflip is joined or cancelled, THE Token Gamble System SHALL immediately remove it from the lobby for all connected users
5. WHEN a user views the lobby, THE Token Gamble System SHALL organize coinflips by creation time with newest first

### Requirement 6: Coinflip Cancellation

**User Story:** As a coinflip creator, I want to cancel my open coinflip, so that I can change my mind before an opponent joins.

#### Acceptance Criteria

1. WHEN a user views their own open coinflip, THE Token Gamble System SHALL display a cancel button
2. WHEN a user clicks the cancel button, THE Token Gamble System SHALL delete the coinflip record from Supabase
3. WHEN a coinflip is cancelled, THE Token Gamble System SHALL unlock the associated prompt for future use
4. WHEN a coinflip is cancelled, THE Token Gamble System SHALL remove it from the lobby for all users via real-time update

### Requirement 7: Joining a Coinflip

**User Story:** As a user, I want to join an open coinflip that matches my desired response depth, so that I can wager my API usage against another user.

#### Acceptance Criteria

1. WHEN a user views an open coinflip in the lobby, THE Token Gamble System SHALL display a join button if the user has loaded prompts
2. WHEN a user clicks join on a coinflip, THE Token Gamble System SHALL display the user's loaded prompts to choose from
3. WHEN a user selects a prompt to wager, THE Token Gamble System SHALL assign the user the opposite coin side from the creator
4. WHEN a user confirms joining, THE Token Gamble System SHALL update the coinflip record in Supabase with the joiner's information
5. WHEN a user joins a coinflip, THE Token Gamble System SHALL mark the selected prompt as locked for that coinflip
6. WHEN a coinflip is joined, THE Token Gamble System SHALL change the coinflip status from open to active

### Requirement 8: Coinflip Animation and Execution

**User Story:** As a user participating in a coinflip, I want to see a smooth animated coin flip, so that the experience feels engaging and fair.

#### Acceptance Criteria

1. WHEN a coinflip becomes active, THE Token Gamble System SHALL display an animated coin flipping sequence to both participants
2. WHEN the coin flip animation begins, THE Token Gamble System SHALL generate a random outcome (heads or tails)
3. WHEN the coin flip animation completes, THE Token Gamble System SHALL display the result clearly showing which side won
4. WHEN the coin flip animation completes, THE Token Gamble System SHALL determine the winner based on coin side selection
5. THE Token Gamble System SHALL ensure the coin flip animation duration is between 2 and 4 seconds for optimal user experience

### Requirement 9: Winner Determination and Celebration

**User Story:** As a coinflip winner, I want to see a celebration animation, so that my victory feels rewarding and exciting.

#### Acceptance Criteria

1. WHEN a user wins a coinflip, THE Token Gamble System SHALL display a confetti animation on the winner's screen
2. WHEN a user wins a coinflip, THE Token Gamble System SHALL display a victory message indicating they won
3. WHEN a user loses a coinflip, THE Token Gamble System SHALL display a loss message without celebration effects
4. WHEN the coinflip result is determined, THE Token Gamble System SHALL update the coinflip record in Supabase with the winner and loser

### Requirement 10: API Call Execution for Winner

**User Story:** As a coinflip winner, I want my prompt answered using the loser's API key, so that I receive the response I wagered for without using my own tokens.

#### Acceptance Criteria

1. WHEN a coinflip is won, THE Token Gamble System SHALL retrieve the loser's OpenAI API key from Supabase
2. WHEN the loser's API key is retrieved, THE Token Gamble System SHALL construct an API call with the winner's prompt
3. WHEN constructing the API call, THE Token Gamble System SHALL include instructions to limit response length based on the selected depth (short, medium, or long)
4. WHEN the API call is made, THE Token Gamble System SHALL use the loser's API key for authentication
5. WHEN the API response is received, THE Token Gamble System SHALL store the response in Supabase associated with the winner's prompt
6. WHEN the API response is stored, THE Token Gamble System SHALL move the winner's prompt to their settled tab with the response

### Requirement 11: Response Viewing for Winner

**User Story:** As a coinflip winner, I want to view my answered prompt, so that I can read the response I earned.

#### Acceptance Criteria

1. WHEN a winner's prompt is answered, THE Token Gamble System SHALL make the response visible only to the winner
2. WHEN a winner navigates to their settled tab, THE Token Gamble System SHALL display the prompt with its full response
3. WHEN a loser's API key is used, THE Token Gamble System SHALL not display the winner's prompt or response to the loser

### Requirement 12: Response Depth Token Management

**User Story:** As a user, I want response depths to correspond to predictable token usage, so that wagers are fair and consistent.

#### Acceptance Criteria

1. WHEN a short response depth is selected, THE Token Gamble System SHALL instruct the OpenAI API to limit responses to approximately 100-150 tokens
2. WHEN a medium response depth is selected, THE Token Gamble System SHALL instruct the OpenAI API to limit responses to approximately 300-400 tokens
3. WHEN a long response depth is selected, THE Token Gamble System SHALL instruct the OpenAI API to limit responses to approximately 600-800 tokens
4. WHEN making an API call, THE Token Gamble System SHALL include the max_tokens parameter corresponding to the selected depth

### Requirement 13: User Interface Animations and Polish

**User Story:** As a user, I want smooth animations throughout the interface, so that the application feels polished and professional.

#### Acceptance Criteria

1. WHEN a user navigates between pages, THE Token Gamble System SHALL display smooth page transition animations
2. WHEN a user interacts with buttons, THE Token Gamble System SHALL provide visual feedback through hover and click animations
3. WHEN new items appear in lists (prompts, coinflips), THE Token Gamble System SHALL animate their entrance
4. WHEN items are removed from lists, THE Token Gamble System SHALL animate their exit
5. THE Token Gamble System SHALL maintain animation frame rates above 30 FPS for smooth visual experience

### Requirement 14: Error Handling for API Calls

**User Story:** As a user, I want to be notified if something goes wrong with the API call, so that I understand what happened and can take appropriate action.

#### Acceptance Criteria

1. WHEN an API call fails due to invalid API key, THE Token Gamble System SHALL display an error message to both participants
2. WHEN an API call fails due to rate limiting, THE Token Gamble System SHALL display an error message indicating the issue
3. WHEN an API call fails, THE Token Gamble System SHALL unlock both prompts so users can try again
4. WHEN an API call fails, THE Token Gamble System SHALL log the error details in Supabase for debugging
5. IF an API call fails, THEN THE Token Gamble System SHALL not mark the coinflip as settled

### Requirement 15: Responsive Design

**User Story:** As a user on different devices, I want the interface to work well on my screen size, so that I can use the application on desktop, tablet, or mobile.

#### Acceptance Criteria

1. WHEN a user accesses the Token Gamble System on a desktop browser, THE Token Gamble System SHALL display the full interface optimized for large screens
2. WHEN a user accesses the Token Gamble System on a tablet, THE Token Gamble System SHALL adjust the layout for medium-sized screens
3. WHEN a user accesses the Token Gamble System on a mobile device, THE Token Gamble System SHALL display a mobile-optimized layout
4. WHEN the viewport size changes, THE Token Gamble System SHALL responsively adjust the interface without requiring a page reload
