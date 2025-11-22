# Coinflip Synchronization Fix - Requirements

## Introduction

This spec addresses critical issues with the coinflip flow where winner/loser determination is incorrect and the experience is not synchronized between creator and joiner.

## Glossary

- **Creator**: The user who creates a coinflip and chooses a coin side
- **Joiner**: The user who joins an existing coinflip
- **Coinflip System**: The backend system that manages coinflip state and determines winners
- **Settled Flip**: A completed coinflip that can be viewed but not joined
- **Lobby**: The main page showing open and settled coinflips

## Requirements

### Requirement 1: Correct Winner Determination

**User Story:** As a user participating in a coinflip, I want the winner to be determined correctly based on the coin result, so that the right person gets their prompt answered.

#### Acceptance Criteria

1. WHEN the coin result matches the creator's chosen side, THE Coinflip System SHALL designate the creator as the winner
2. WHEN the coin result does not match the creator's chosen side, THE Coinflip System SHALL designate the joiner as the winner
3. THE Coinflip System SHALL provide the winner's prompt text to the OpenAI API
4. THE Coinflip System SHALL use the loser's API key to generate the answer
5. THE Coinflip System SHALL update the winner's prompt status to 'settled' with the answer
6. THE Coinflip System SHALL update the loser's prompt status back to 'loaded' without an answer

### Requirement 2: Synchronized Flip Experience

**User Story:** As a user participating in a coinflip, I want both the creator and joiner to see the flip happen simultaneously, so that the experience feels fair and transparent.

#### Acceptance Criteria

1. WHEN a joiner joins a coinflip, THE Coinflip System SHALL notify the creator via real-time update
2. WHEN the flip is triggered, THE Coinflip System SHALL show a 5-second countdown to both users
3. DURING the countdown, THE Coinflip System SHALL prevent any user from leaving or canceling
4. AFTER the countdown, THE Coinflip System SHALL display the coin animation to both users simultaneously
5. WHEN the coin lands, THE Coinflip System SHALL show the result to both users
6. THE Coinflip System SHALL display the correct win/lose message to each user based on the actual result

### Requirement 3: Settled Flips Visibility

**User Story:** As a user who participated in a coinflip, I want to view the results in a settled section, so that I can see the outcome and access my answer if I won.

#### Acceptance Criteria

1. WHEN a coinflip completes, THE Coinflip System SHALL move it to the 'settled' status
2. THE Coinflip System SHALL remove settled flips from the open coinflips section in the lobby
3. THE Coinflip System SHALL display settled flips in a dedicated 'Settled Flips' section in the lobby
4. THE Coinflip System SHALL allow both participants to view the settled flip details
5. THE Coinflip System SHALL prevent any user from joining a settled flip
6. WHEN viewing a settled flip, THE Coinflip System SHALL show the coin result, winner, and loser
7. THE Coinflip System SHALL display the answer only to the winner in the settled view

### Requirement 4: Prompts Page Settled View

**User Story:** As a user who won a coinflip, I want to see my answered prompt in the Prompts > Settled section, so that I can easily access my answers.

#### Acceptance Criteria

1. THE Coinflip System SHALL display settled prompts in the Prompts page 'Settled' tab
2. WHEN a user views their settled prompts, THE Coinflip System SHALL show the prompt text and answer for won flips
3. WHEN a user views their settled prompts, THE Coinflip System SHALL show the prompt text without an answer for lost flips
4. THE Coinflip System SHALL indicate whether each settled prompt was won or lost
5. THE Coinflip System SHALL display the coinflip details (opponent, coin result, date) for each settled prompt

### Requirement 5: Truly Random Coin Flip

**User Story:** As a user participating in a coinflip, I want the coin result to be truly random with a 50/50 chance of heads or tails, so that the game is fair and unpredictable.

#### Acceptance Criteria

1. THE Coinflip System SHALL generate a cryptographically secure random result for each flip
2. THE Coinflip System SHALL ensure each result has exactly 50% probability of being heads and 50% probability of being tails
3. THE Coinflip System SHALL verify the random generation is working correctly through logging
4. WHEN the random API call fails, THE Coinflip System SHALL use a fallback local generation method with the same 50/50 probability
5. THE Coinflip System SHALL log all random generation attempts including the generated value for debugging
6. THE Coinflip System SHALL ensure the random result is generated only once per flip
7. THE Coinflip System SHALL prevent any user from manipulating the random result
8. THE Coinflip System SHALL test that over multiple flips, the distribution approaches 50/50

## Non-Functional Requirements

### Performance
- Countdown and coin animation SHALL complete within 8 seconds total
- Real-time updates SHALL propagate to both users within 1 second
- Random generation SHALL complete within 500ms

### Security
- Random generation SHALL use cryptographically secure methods
- API keys SHALL never be exposed to the client
- Users SHALL only access their own prompts and coinflips they participated in

### Reliability
- The system SHALL handle network failures gracefully with fallback mechanisms
- The system SHALL maintain data consistency even if one user disconnects
- The system SHALL prevent race conditions in coinflip state updates
