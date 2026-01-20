/**
 * Property-Based Tests for Error Screens
 * Feature: sneakergram-app
 * Validates: Requirements 15.5
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { ErrorScreen } from '@/components/ui/ErrorScreen';

/**
 * Feature: sneakergram-app, Property 42: Errors display designed screens
 * Validates: Requirements 15.5
 * 
 * For any error that occurs in the application, the system should display
 * a designed error screen with a helpful message instead of crashing.
 */
describe('Error Screens Property Tests', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  it('Property 42: All errors display designed screens with helpful messages', () => {
    fc.assert(
      fc.property(
        fc.record({
          errorMessage: fc.oneof(
            fc.constant('Network error'),
            fc.constant('fetch failed'),
            fc.constant('Not found'),
            fc.constant('404 error'),
            fc.constant('Unauthorized access'),
            fc.constant('auth failed'),
            fc.constant('Request timeout'),
            fc.constant('timeout exceeded'),
            fc.constant('Unknown error'),
            fc.string().filter(s => s.length > 0)
          ),
          title: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          customMessage: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
        }),
        ({ errorMessage, title, customMessage }) => {
          // Create error object
          const error = new Error(errorMessage);
          
          // Render error screen
          const { container } = render(
            <ErrorScreen
              error={error}
              title={title}
              message={customMessage}
            />
          );
          
          // Verify designed screen is displayed (not a crash)
          expect(container).toBeTruthy();
          
          // Verify error icon is present
          const errorIcon = container.querySelector('svg');
          expect(errorIcon).toBeTruthy();
          
          // Verify title is displayed
          const titleElements = screen.getAllByRole('heading', { level: 1 });
          expect(titleElements.length).toBeGreaterThan(0);
          // Title should have content (either custom or default)
          const hasNonEmptyTitle = titleElements.some(el => 
            el.textContent && el.textContent.trim().length > 0
          );
          expect(hasNonEmptyTitle).toBe(true);
          
          // Verify helpful message is displayed
          const messageElements = screen.getAllByText(/./);
          const hasMessage = messageElements.some(el => 
            el.textContent && el.textContent.trim().length > 0
          );
          expect(hasMessage).toBe(true);
          
          // Verify action buttons are present
          const buttons = screen.queryAllByRole('button');
          expect(buttons.length).toBeGreaterThan(0);
          
          // Verify the screen doesn't crash
          expect(() => container).not.toThrow();
          
          // Clean up for next iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 42a: Error screens provide recovery options', () => {
    fc.assert(
      fc.property(
        fc.record({
          errorMessage: fc.string(),
          showHomeButton: fc.boolean(),
          showRefreshButton: fc.boolean(),
        }),
        ({ errorMessage, showHomeButton, showRefreshButton }) => {
          const error = new Error(errorMessage);
          
          const { container } = render(
            <ErrorScreen
              error={error}
              showHomeButton={showHomeButton}
              showRefreshButton={showRefreshButton}
            />
          );
          
          const buttons = screen.queryAllByRole('button');
          
          // Count expected buttons
          let expectedButtons = 0;
          if (showHomeButton) expectedButtons++;
          if (showRefreshButton) expectedButtons++;
          
          expect(buttons.length).toBe(expectedButtons);
          
          // Verify screen renders without crashing
          expect(container).toBeTruthy();
          
          // Clean up for next iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 42b: Error messages are user-friendly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({
            type: fc.constant('network'),
            message: fc.constant('network error occurred'),
          }),
          fc.record({
            type: fc.constant('notfound'),
            message: fc.constant('resource not found'),
          }),
          fc.record({
            type: fc.constant('auth'),
            message: fc.constant('authentication failed'),
          }),
          fc.record({
            type: fc.constant('timeout'),
            message: fc.constant('request timeout'),
          }),
        ),
        ({ message }) => {
          const error = new Error(message);
          
          render(<ErrorScreen error={error} />);
          
          // Get all text content
          const allText = screen.queryAllByText(/./);
          const fullText = allText.map(el => el.textContent).join(' ').toLowerCase();
          
          // Verify message contains user-friendly language
          // The error message function should convert technical errors to friendly messages
          const hasFriendlyLanguage = 
            fullText.includes('try again') ||
            fullText.includes('check') ||
            fullText.includes('please') ||
            fullText.includes('contact') ||
            fullText.includes('support') ||
            fullText.includes('help') ||
            fullText.includes('again');
          
          expect(hasFriendlyLanguage).toBe(true);
          
          // Clean up for next iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 42c: Error screens never crash the application', () => {
    fc.assert(
      fc.property(
        fc.record({
          error: fc.option(
            fc.record({
              message: fc.string(),
              stack: fc.option(fc.string(), { nil: undefined }),
            }),
            { nil: null }
          ),
          title: fc.option(fc.string(), { nil: undefined }),
          message: fc.option(fc.string(), { nil: undefined }),
        }),
        ({ error, title, message }) => {
          // Convert error object to Error instance if present
          const errorInstance = error ? new Error(error.message) : null;
          if (errorInstance && error?.stack) {
            errorInstance.stack = error.stack;
          }
          
          // This should never throw, even with null/undefined values
          expect(() => {
            render(
              <ErrorScreen
                error={errorInstance}
                title={title}
                message={message}
              />
            );
            
            // Clean up for next iteration
            cleanup();
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});
