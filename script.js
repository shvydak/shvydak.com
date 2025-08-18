// Modern Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
     // Initialize the dashboard
     initDashboard()

     // Add service card interactions
     addCardInteractions()

     // Add keyboard navigation
     addKeyboardNavigation()

     // Add service status indicators (placeholder for future implementation)
     addServiceStatusIndicators()
})

function initDashboard() {
     console.log('🚀 Shvydak Dashboard initialized')

     // Add loading animation
     document.body.classList.add('loaded')

     // Add parallax effect to background
     addParallaxEffect()
}

function addCardInteractions() {
     const serviceCards = document.querySelectorAll('.service-card')

     serviceCards.forEach((card) => {
          // Add click handler for the entire card
          card.addEventListener('click', function (e) {
               // Don't trigger if clicking on the link itself
               if (e.target.closest('.service-link')) {
                    return
               }

               const link = card.querySelector('.service-link:not(.disabled)')
               if (link) {
                    // Add click animation
                    card.style.transform = 'scale(0.95)'
                    setTimeout(() => {
                         card.style.transform = ''
                         link.click()
                    }, 150)
               }
          })

          // Add hover sound effect (optional)
          card.addEventListener('mouseenter', function () {
               addHoverEffect(card)
          })

          card.addEventListener('mouseleave', function () {
               removeHoverEffect(card)
          })

          // Add focus styles for accessibility
          card.addEventListener('focus', function () {
               card.style.outline = '2px solid var(--primary-color)'
               card.style.outlineOffset = '2px'
          })

          card.addEventListener('blur', function () {
               card.style.outline = ''
               card.style.outlineOffset = ''
          })
     })
}

function addHoverEffect(card) {
     // Add subtle glow effect
     card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)'

     // Add ripple effect
     const ripple = document.createElement('div')
     ripple.className = 'ripple'
     ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        margin: -50px 0 0 -50px;
    `

     card.appendChild(ripple)

     setTimeout(() => {
          if (ripple.parentNode) {
               ripple.parentNode.removeChild(ripple)
          }
     }, 600)
}

function removeHoverEffect(card) {
     card.style.boxShadow = ''
}

function addParallaxEffect() {
     window.addEventListener('scroll', function () {
          const scrolled = window.pageYOffset
          const background = document.querySelector('.background-animation')

          if (background) {
               background.style.transform = `translateY(${scrolled * 0.5}px)`
          }
     })
}

function addKeyboardNavigation() {
     const serviceCards = document.querySelectorAll('.service-card')
     let currentIndex = 0

     document.addEventListener('keydown', function (e) {
          switch (e.key) {
               case 'ArrowRight':
               case 'ArrowDown':
                    e.preventDefault()
                    currentIndex = (currentIndex + 1) % serviceCards.length
                    serviceCards[currentIndex].focus()
                    break

               case 'ArrowLeft':
               case 'ArrowUp':
                    e.preventDefault()
                    currentIndex =
                         (currentIndex - 1 + serviceCards.length) %
                         serviceCards.length
                    serviceCards[currentIndex].focus()
                    break

               case 'Enter':
               case ' ':
                    e.preventDefault()
                    const focusedCard = document.querySelector(
                         '.service-card:focus',
                    )
                    if (focusedCard) {
                         focusedCard.click()
                    }
                    break
          }
     })

     // Make cards focusable
     serviceCards.forEach((card) => {
          card.setAttribute('tabindex', '0')
     })
}

function addServiceStatusIndicators() {
     // This is a placeholder for future implementation
     // You can add real-time status checking here

     const serviceCards = document.querySelectorAll('.service-card')

     serviceCards.forEach((card) => {
          const serviceName = card.getAttribute('data-service')
          const statusIndicator = document.createElement('div')
          statusIndicator.className = 'status-indicator'
          statusIndicator.style.cssText = `
            position: absolute;
            top: 1rem;
            left: 1rem;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success);
            box-shadow: 0 0 10px var(--success);
            animation: pulse 2s infinite;
        `

          // For now, show all as online
          // In the future, you can check actual service status
          card.appendChild(statusIndicator)
     })
}

// Add CSS animations dynamically
const style = document.createElement('style')
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1);
        }
    }
    
    .service-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .service-card:active {
        transform: scale(0.98);
    }
    
    .status-indicator {
        transition: all 0.3s ease;
    }
    
    .status-indicator.offline {
        background: var(--error);
        box-shadow: 0 0 10px var(--error);
    }
    
    .status-indicator.warning {
        background: var(--warning);
        box-shadow: 0 0 10px var(--warning);
    }
`

document.head.appendChild(style)

// Add service status checking (example)
function checkServiceStatus(serviceName) {
     // This is a placeholder for actual service status checking
     // You can implement real HTTP requests to check if services are online

     return new Promise((resolve) => {
          // Simulate status check
          setTimeout(() => {
               // For demo purposes, return random status
               const statuses = ['online', 'offline', 'warning']
               const randomStatus =
                    statuses[Math.floor(Math.random() * statuses.length)]
               resolve(randomStatus)
          }, Math.random() * 1000)
     })
}

// Add search functionality
function addSearchFunctionality() {
     const searchInput = document.createElement('input')
     searchInput.type = 'text'
     searchInput.placeholder = 'Search services...'
     searchInput.className = 'search-input'
     searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        color: var(--text-primary);
        font-size: 1rem;
        margin-bottom: 2rem;
        outline: none;
        transition: all 0.3s ease;
    `

     searchInput.addEventListener('input', function (e) {
          const searchTerm = e.target.value.toLowerCase()
          const serviceCards = document.querySelectorAll('.service-card')

          serviceCards.forEach((card) => {
               const title = card.querySelector('h3').textContent.toLowerCase()
               const description = card
                    .querySelector('p')
                    .textContent.toLowerCase()

               if (
                    title.includes(searchTerm) ||
                    description.includes(searchTerm)
               ) {
                    card.style.display = 'block'
                    card.style.animation = 'cardAppear 0.3s ease-out'
               } else {
                    card.style.display = 'none'
               }
          })
     })

     // Insert search input after header
     const header = document.querySelector('.header')
     header.parentNode.insertBefore(searchInput, header.nextSibling)
}

// Initialize search after a delay
setTimeout(addSearchFunctionality, 1000)

// Add theme toggle functionality
function addThemeToggle() {
     const themeToggle = document.createElement('button')
     themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
     themeToggle.className = 'theme-toggle'
     themeToggle.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        z-index: 1000;
    `

     themeToggle.addEventListener('click', function () {
          document.body.classList.toggle('light-theme')
          const icon = themeToggle.querySelector('i')
          if (document.body.classList.contains('light-theme')) {
               icon.className = 'fas fa-sun'
          } else {
               icon.className = 'fas fa-moon'
          }
     })

     document.body.appendChild(themeToggle)
}

// Initialize theme toggle
setTimeout(addThemeToggle, 500)

// Add performance monitoring
function addPerformanceMonitoring() {
     // Monitor page load time
     window.addEventListener('load', function () {
          const loadTime = performance.now()
          console.log(`📊 Page loaded in ${loadTime.toFixed(2)}ms`)
     })

     // Monitor card interactions
     const serviceCards = document.querySelectorAll('.service-card')
     serviceCards.forEach((card) => {
          card.addEventListener('click', function () {
               const serviceName = card.getAttribute('data-service')
               console.log(`🎯 Service clicked: ${serviceName}`)
          })
     })
}

// Initialize performance monitoring
addPerformanceMonitoring()
