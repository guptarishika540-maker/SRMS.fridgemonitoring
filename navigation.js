import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { auth, db } from "./firebase-init.js";

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupNotificationsBadge();
});

function setupNavigation() {
  const path = window.location.pathname;
  
  // 1. Desktop Sidebar Navigation Setup
  const asideItems = document.querySelectorAll('aside nav > *, aside div.mt-auto > *, aside div.pt-6 > *');
  asideItems.forEach(item => {
    const text = item.innerText || '';
    
    if (text.includes('Dashboard')) {
      bindNavItem(item, 'Dashboard.html', path.endsWith('Dashboard.html'));
    } else if (text.includes('Inventory')) {
      bindNavItem(item, 'Inventory.html', path.endsWith('Inventory.html'));
    } else if (text.includes('Notifications') || text.includes('Alerts')) {
      bindNavItem(item, 'Alerts.html', path.endsWith('Alerts.html'));
    } else if (text.includes('Analytics')) {
      bindNavItem(item, 'Analytics.html', path.endsWith('Analytics.html'));
    } else if (text.includes('About')) {
      bindNavItem(item, 'About.html', path.endsWith('About.html'));
    } else if (text.includes('Sign Out') || text.includes('logout')) {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
          window.location.href = 'home.html';
        });
      });
      item.classList.add('cursor-pointer');
    }
  });

  // 2. Mobile Bottom Navbar Setup
  const mobileNav = document.querySelector('nav.md\\:hidden');
  if (mobileNav) {
    const mobileItems = mobileNav.querySelectorAll('a, div.flex-col');
    mobileItems.forEach(item => {
      const text = item.innerText || '';
      
      if (text.includes('Home') || text.includes('Dash')) {
        bindMobileItem(item, 'Dashboard.html', path.endsWith('Dashboard.html'));
      } else if (text.includes('Inventory') || text.includes('Inv')) {
        bindMobileItem(item, 'Inventory.html', path.endsWith('Inventory.html'));
      } else if (text.includes('Alerts') || text.includes('Notifications')) {
        bindMobileItem(item, 'Alerts.html', path.endsWith('Alerts.html'));
      } else if (text.includes('Settings') || text.includes('Setup') || text.includes('About')) {
        bindMobileItem(item, 'About.html', path.endsWith('About.html'));
      }
    });
  }
}

function bindNavItem(element, targetUrl, isActive) {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = targetUrl;
  });
  element.classList.add('cursor-pointer');
  
  if (isActive) {
    element.className = "group cursor-pointer flex items-center gap-stack-gap p-3 transition-transform bg-secondary-container text-on-secondary-container rounded-lg font-bold";
    const icon = element.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.style.fontVariationSettings = "'FILL' 1";
    }
  } else {
    element.className = "group cursor-pointer flex items-center gap-stack-gap p-3 transition-transform text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest rounded-lg";
    const icon = element.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.style.fontVariationSettings = "'FILL' 0";
    }
  }
}

function bindMobileItem(element, targetUrl, isActive) {
  element.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = targetUrl;
  });
  element.classList.add('cursor-pointer');
  
  if (isActive) {
    element.className = "flex flex-col items-center text-secondary font-bold";
    const icon = element.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.style.fontVariationSettings = "'FILL' 1";
    }
  } else {
    element.className = "flex flex-col items-center text-on-surface-variant";
    const icon = element.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.style.fontVariationSettings = "'FILL' 0";
    }
  }
}

function setupNotificationsBadge() {
  const path = window.location.pathname;
  const isAlertsPage = path.endsWith('Alerts.html');

  // Monitor sensor alert status
  onValue(ref(db, 'sensor/alert'), (snapshot) => {
    const sensorAlert = snapshot.val();
    
    // Monitor inventory for items expiring within 3 days
    onValue(ref(db, 'inventory'), (invSnapshot) => {
      const inventory = invSnapshot.val() || {};
      let expiryAlertsCount = 0;
      
      const now = new Date();
      Object.values(inventory).forEach(item => {
        if (item.expiryDate) {
          const exp = new Date(item.expiryDate);
          const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 3) {
            expiryAlertsCount++;
          }
        }
      });

      let activeAlerts = 0;
      if (sensorAlert && sensorAlert !== 'NORMAL' && sensorAlert !== 'None') {
        activeAlerts = 1;
      }
      
      const totalAlerts = activeAlerts + expiryAlertsCount;
      let unreadCount = isAlertsPage ? 0 : totalAlerts;
      
      updateBadgeUI(unreadCount);
    });
  });
}

function updateBadgeUI(count) {
  // Desktop
  const asideItems = document.querySelectorAll('aside nav > *');
  asideItems.forEach(item => {
    if (item.innerText.includes('Notifications') || item.innerText.includes('Alerts')) {
      const existingBadge = item.querySelector('.unread-badge');
      if (existingBadge) existingBadge.remove();
      
      if (count > 0) {
        const badge = document.createElement('span');
        badge.className = 'unread-badge bg-error text-on-error font-badge text-[10px] px-1.5 py-0.5 rounded-full ml-auto';
        badge.innerText = count;
        item.appendChild(badge);
      }
    }
  });

  // Mobile
  const mobileNav = document.querySelector('nav.md\\:hidden');
  if (mobileNav) {
    const mobileItems = mobileNav.querySelectorAll('a, div.flex-col');
    mobileItems.forEach(item => {
      if (item.innerText.includes('Alerts') || item.innerText.includes('Notifications')) {
        const existingBadge = item.querySelector('.unread-badge-mobile');
        if (existingBadge) existingBadge.remove();
        
        if (count > 0) {
          const iconWrapper = item.querySelector('.material-symbols-outlined');
          if (iconWrapper) {
            iconWrapper.style.position = 'relative';
            const badge = document.createElement('span');
            badge.className = 'unread-badge-mobile absolute -top-1 -right-1 bg-error text-on-error text-[8px] font-badge px-1 py-0.5 rounded-full flex items-center justify-center min-w-[14px] h-[14px]';
            badge.innerText = count;
            iconWrapper.appendChild(badge);
          }
        }
      }
    });
  }
}
