# Repository Guidelines

This project is a desktop trading risk calculator built with Electron and React.

## Coding Standards
- Keep code in the existing ES module style.
- Use sensible formatting similar to the existing code base.
- Follow React functional component patterns with hooks.
- Use descriptive variable names for financial calculations.
- Implement proper error handling for user inputs and calculations.
- Add comments for complex trading formulas and risk calculations.

## File Structure
- Main process code should be in `src/main/`
- React components should be in `src/renderer/`
- Shared utilities and constants should be in `src/shared/`
- Test files should be in `test/` directory

## Testing Instructions
- Run `npm test` before committing any changes. This executes `test/test.mjs`.
- Install dependencies with `npm install` if not already installed.
- A successful test run should output `All tests passed`.
- Test all calculation functions with edge cases (zero values, negative numbers, etc.)
- Verify UI components render correctly with different input values.

## Development Workflow
1. Create feature branches for new functionality
2. Write tests for new calculations or components
3. Ensure all existing tests pass
4. Test the application manually in development mode
5. Update documentation if adding new features

## Financial Calculation Guidelines
- Always validate user input before performing calculations
- Use appropriate decimal precision for monetary values
- Handle division by zero scenarios gracefully
- Implement safeguards against unrealistic risk percentages
- Ensure calculations are consistent with standard trading practices

## UI/UX Considerations
- Provide clear feedback for invalid inputs
- Use consistent formatting for currency displays
- Implement appropriate input validation and error messages
- Ensure the interface is intuitive for traders of all experience levels

## Security Notes
- Never store sensitive financial information locally
- Validate all user inputs to prevent injection attacks
- Use secure communication for any external API calls
- Implement proper data sanitization for user inputs
