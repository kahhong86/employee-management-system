describe('Employee Management System - E2E Tests', () => {
  beforeEach(() => {
    // Mock the Random User API to ensure consistent test data
    cy.intercept('GET', 'https://randomuser.me/api/?results=20', {
      fixture: 'employees.json'
    }).as('getEmployees')
    
    // Visit the home page
    cy.visit('/')
    cy.waitForPageLoad()
  })

  describe('Page Navigation & Display', () => {
    it('should load the main page correctly', () => {
      cy.title().should('eq', 'Employee Management System')
      cy.get('[data-testid="app-layout"]').should('be.visible')
      cy.get('[data-testid="nav-header"]').should('contain', 'Employee Management System')
    })

    it('should navigate to employees page', () => {
      cy.get('[data-testid="nav-employees"]').click()
      cy.url().should('include', '/employees')
      cy.get('h1').should('contain', 'Employees')
    })
  })

  describe('Employee List Display', () => {
    beforeEach(() => {
      cy.get('[data-testid="nav-employees"]').click()
      cy.wait('@getEmployees')
    })

    it('should display loading spinner initially', () => {
      cy.visit('/employees')
      cy.get('.ant-spin').should('be.visible')
    })

    it('should load and display employee table', () => {
      cy.get('[data-testid="employee-table"]').should('be.visible')
      cy.get('.ant-table-thead th').should('have.length.at.least', 6)
      
      // Check table headers
      cy.get('.ant-table-thead').should('contain', 'Name')
      cy.get('.ant-table-thead').should('contain', 'Email')
      cy.get('.ant-table-thead').should('contain', 'Phone')
      cy.get('.ant-table-thead').should('contain', 'Gender')
      cy.get('.ant-table-thead').should('contain', 'Joined Date')
      cy.get('.ant-table-thead').should('contain', 'Actions')
    })

    it('should display employee data in correct format', () => {
      cy.get('.ant-table-tbody tr').first().within(() => {
        // Check that data is formatted correctly
        cy.get('td').eq(1).should('contain', '@') // Email should contain @
        cy.get('td').eq(2).should('contain', '+65') // Phone should contain Singapore country code
      })
    })

    it('should show action buttons for each employee', () => {
      cy.get('.ant-table-tbody tr').first().within(() => {
        cy.get('[data-testid="view-employee"]').should('be.visible')
        cy.get('[data-testid="edit-employee"]').should('be.visible')
        cy.get('[data-testid="delete-employee"]').should('be.visible')
      })
    })

    it('should handle pagination if more than 10 employees', () => {
      cy.get('.ant-table-tbody tr').should('have.length.at.most', 10)
      cy.get('.ant-pagination').should('be.visible')
    })
  })

  describe('CRUD Operations', () => {
    beforeEach(() => {
      cy.get('[data-testid="nav-employees"]').click()
      cy.wait('@getEmployees')
    })

    describe('Create Employee', () => {
      it('should navigate to create employee page', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        cy.url().should('include', '/employees/new')
      })

      it('should display employee form with all fields', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        
        cy.get('#firstName').should('be.visible')
        cy.get('#lastName').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#phoneNumber').should('be.visible')
        cy.get('#gender').should('be.visible')
        cy.get('#dateOfBirth').should('be.visible')
        cy.get('#joinedDate').should('be.visible')
      })

      it('should create a new employee successfully', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        
        // Fill out the form
        cy.get('#firstName').type('Michael')
        cy.get('#lastName').type('Learns')
        cy.get('#email').type('michael.learns@example.com')
        cy.get('#phoneNumber').type('91234567')
        cy.get('#gender').click()
        cy.get('.ant-radio-input[value="Male"]').click()
        cy.get('#dateOfBirth').type('01/01/1990')
        cy.get('#joinedDate').type('01/01/2024')

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Check that we are redirected
        cy.url({ timeout: 10000 }).should('include', '/employees');
      })

      it('should validate required fields', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        
        // Try to submit empty form
        cy.get('button[type="submit"]').click()
        
        // Should show validation errors
        cy.get('.ant-form-item-explain-error').should('be.visible')
      })

      it('should validate email format', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        
        cy.get('#email').type('invalid-email')
        cy.get('#firstName').click() // Trigger validation
        
        cy.get('.ant-form-item-explain-error').should('contain', 'Please enter a valid email')
      })

      it('should validate Singapore phone number format', () => {
        cy.get('[data-testid="add-employee-btn"]').click()
        
        cy.get('#phoneNumber').type('12345') // Invalid format
        cy.get('#firstName').click() // Trigger validation
        
        cy.get('.ant-form-item-explain-error').should('contain', 'Please enter 8 digits starting with 8 or 9!')
      })
    })

    describe('View Employee', () => {
      it('should navigate to employee details page', () => {
        cy.get('[data-testid="view-employee"]').first().click()
        cy.url().should('match', /\/employees\/\d+$/)
      })

      it('should display employee information', () => {
        cy.get('[data-testid="view-employee"]').first().click()
        
        cy.get('.ant-descriptions').should('be.visible')
        cy.get('.ant-descriptions-item-label').should('contain', 'First Name')
        cy.get('.ant-descriptions-item-label').should('contain', 'Last Name')
        cy.get('.ant-descriptions-item-label').should('contain', 'Email')
        cy.get('.ant-descriptions-item-label').should('contain', 'Phone Number')
        cy.get('.ant-descriptions-item-label').should('contain', 'Gender')
        cy.get('.ant-descriptions-item-label').should('contain', 'Date of Birth')
        cy.get('.ant-descriptions-item-label').should('contain', 'Joined Date')
      })

      it('should have edit and delete buttons', () => {
        cy.get('[data-testid="view-employee"]').first().click()
        
        cy.get('[data-testid="edit-employee-btn"]').should('be.visible')
        cy.get('[data-testid="delete-employee-btn"]').should('be.visible')
      })
    })

    describe('Edit Employee', () => {
      it('should navigate to edit employee page', () => {
        cy.get('[data-testid="edit-employee"]').first().click()
        cy.url().should('match', /\/employees\/\d+\/edit$/)
      })

      it('should pre-populate form with existing data', () => {
        cy.get('[data-testid="edit-employee"]').first().click()
        
        // Form fields should have values
        cy.get('#firstName').should('not.have.value', '')
        cy.get('#lastName').should('not.have.value', '')
        cy.get('#email').should('not.have.value', '')
        cy.get('#phoneNumber').should('not.have.value', '')
      })

      it('should update employee successfully', () => {
        cy.get('[data-testid="edit-employee"]').first().click()
        
        // Update some fields
        cy.get('#firstName').clear().type('Jane')
        cy.get('#lastName').clear().type('Smith')
        
        // Submit the form
        cy.get('button[type="submit"]').click()
        
        // Should redirect to employees list
        cy.url().should('include', '/employees')
      })

      it('should validate form fields on edit', () => {
        cy.get('[data-testid="edit-employee"]').first().click()
        
        // Clear required field
        cy.get('#firstName').clear()
        cy.get('button[type="submit"]').click()
        
        // Should show validation error
        cy.get('.ant-form-item-explain-error').should('be.visible')
      })
    })

    describe('Delete Employee', () => {
      it('should show delete confirmation modal', () => {
        cy.get('[data-testid="delete-employee"]').first().click()
        
        cy.get('.ant-modal').should('be.visible')
        cy.get('.ant-modal-confirm-title').should('contain', 'Are you sure you want to delete this employee?')
      })

      it('should cancel delete operation', () => {
        cy.get('[data-testid="delete-employee"]').first().click()
        
        cy.get('.ant-modal .ant-btn').contains('Cancel').click()
        cy.get('.ant-modal').should('not.exist')
      })

      it('should delete employee successfully', () => {
        // Get initial row count
        cy.get('.ant-table-tbody tr').then($rows => {
          const initialCount = $rows.length
          
          cy.get('[data-testid="delete-employee"]').first().click()
          cy.get('.ant-modal-body .ant-modal-confirm-btns .ant-btn').contains('Yes, Delete').click()
          
          // Should show success message
          cy.get('.ant-message-success', { timeout: 5000 }).should('exist').and('be.visible')

          // Should have one less row (or check that specific employee is gone)
          cy.get('.ant-table-tbody tr').should('have.length', initialCount - 1)
        })
      })
    })
  })

  describe('Form Validation & User Experience', () => {
    beforeEach(() => {
      cy.get('[data-testid="nav-employees"]').click()
      cy.wait('@getEmployees')
      cy.get('[data-testid="add-employee-btn"]').click()
    })

    it('should show unsaved changes warning when navigating away', () => {
      // Fill some data
      cy.get('#firstName').type('John')
      
      // Try to navigate away
      cy.get('[data-testid="nav-dashboard"]').click()
      
      // Should show confirmation dialog
      cy.get('.ant-modal').should('be.visible')
      cy.get('.ant-modal-body').should('contain', 'unsaved changes')
    })

    it('should allow navigation without warning when form is pristine', () => {
      // Don't fill any data
      cy.get('[data-testid="nav-dashboard"]').click()
      
      // Should navigate without warning
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('should format phone number input', () => {
      cy.get('#phoneNumber').type('91234567')
      cy.get('#phoneNumber').should('have.value', '91234567')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API failure
      cy.intercept('GET', 'https://randomuser.me/api/?results=20', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getEmployeesError')
      
      cy.visit('/employees')
      cy.wait('@getEmployeesError')
      
      // Should show error message
      cy.get('.ant-message').should('contain', 'Failed to fetch employee data')
    })

    it('should handle network connectivity issues', () => {
      // Mock network failure
      cy.intercept('GET', 'https://randomuser.me/api/?results=20', { forceNetworkError: true }).as('networkError')
      
      cy.visit('/employees')
      cy.wait('@networkError')
      
      // Should show error message
      cy.get('.ant-message').should('contain', 'Failed to fetch employee data')
    })
  })

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
      cy.get('[data-testid="nav-employees"]').click()
      cy.wait('@getEmployees')
    })

    it('should show mobile-friendly navigation', () => {
      cy.get('[data-testid="nav-header"]').should('be.visible')
    })
  })

  describe('Performance & Loading States', () => {
    it('should show loading states during data fetching', () => {
      cy.visit('/employees')
      
      // Should show loading spinner
      cy.get('.ant-spin').should('be.visible')
      
      cy.wait('@getEmployees')
      
      // Loading spinner should disappear
      cy.get('.ant-spin').should('not.exist')
    })

    it('should load data within reasonable time', () => {
      const start = Date.now()
      
      cy.visit('/employees')
      cy.wait('@getEmployees')
      cy.get('[data-testid="employee-table"]').should('be.visible')
      
      cy.then(() => {
        const loadTime = Date.now() - start
        cy.wrap(loadTime).should('be.lessThan', 5000) // Should load within 5 seconds
      })
    })
  })
})
