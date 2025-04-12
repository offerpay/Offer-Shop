interface AdminCredentials {
  username: string
  password: string
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: "admin",
  password: "password",
}

/**
 * Get admin credentials from storage
 */
export function getAdminCredentials(): AdminCredentials {
  if (typeof window === "undefined") {
    return DEFAULT_CREDENTIALS
  }

  try {
    const storedCredentials = localStorage.getItem("adminCredentials")
    if (!storedCredentials) {
      // Initialize with default credentials if none exist
      localStorage.setItem("adminCredentials", JSON.stringify(DEFAULT_CREDENTIALS))
      return DEFAULT_CREDENTIALS
    }

    return JSON.parse(storedCredentials)
  } catch (error) {
    console.error("Error getting admin credentials:", error)
    return DEFAULT_CREDENTIALS
  }
}

/**
 * Update admin credentials
 */
export function updateAdminCredentials(credentials: AdminCredentials): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    localStorage.setItem("adminCredentials", JSON.stringify(credentials))
    return true
  } catch (error) {
    console.error("Error updating admin credentials:", error)
    return false
  }
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const credentials = getAdminCredentials()
  return credentials.username === username && credentials.password === password
}
