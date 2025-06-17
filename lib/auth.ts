import { supabase } from "./supabase"

export interface UserData {
  id: string
  dni: string
  nombre: string
  rol: "admin" | "usuario"
  es_vegetariano: boolean
  es_celiaco: boolean
  enfermedades?: string
}

// Sistema de autenticación simplificado sin RPC
export async function signInWithDNI(dni: string, nombre: string) {
  try {
    console.log("Iniciando autenticación para DNI:", dni)

    // Verificar si el usuario existe
    const { data: existingUser, error: checkError } = await supabase.from("users").select("*").eq("dni", dni).single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error verificando usuario:", checkError)
      throw new Error("Error al verificar usuario en la base de datos")
    }

    let user = existingUser

    // Si el usuario no existe, crearlo
    if (!existingUser) {
      console.log("Usuario no existe, creando nuevo usuario...")

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          dni: dni.trim(),
          nombre: nombre.trim(),
          rol: "usuario",
          es_vegetariano: false,
          es_celiaco: false,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creando usuario:", insertError)
        throw new Error(`No se pudo crear el usuario: ${insertError.message}`)
      }

      user = newUser
      console.log("Usuario creado exitosamente:", user)
    } else {
      console.log("Usuario existente encontrado:", user)
    }

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("unicen_current_user", JSON.stringify(user))
      localStorage.setItem("unicen_user_dni", dni)
    }

    return { user, success: true }
  } catch (error) {
    console.error("Error en autenticación:", error)
    throw error
  }
}

export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("unicen_current_user")
    localStorage.removeItem("unicen_user_dni")
  }
}

export async function getCurrentUser(): Promise<UserData | null> {
  try {
    if (typeof window === "undefined") return null

    const cachedUser = localStorage.getItem("unicen_current_user")
    const dni = localStorage.getItem("unicen_user_dni")

    if (!cachedUser || !dni) return null

    // Usar datos cacheados
    const user = JSON.parse(cachedUser)

    // Verificar ocasionalmente que el usuario aún existe
    const shouldVerify = Math.random() < 0.1 // 10% de las veces
    if (shouldVerify) {
      const { data: freshUser, error } = await supabase.from("users").select("*").eq("dni", dni).single()

      if (!error && freshUser) {
        // Actualizar cache con datos frescos
        localStorage.setItem("unicen_current_user", JSON.stringify(freshUser))
        return freshUser
      }
    }

    return user
  } catch (error) {
    console.error("Error obteniendo usuario actual:", error)
    // Limpiar cache si hay error
    if (typeof window !== "undefined") {
      localStorage.removeItem("unicen_current_user")
      localStorage.removeItem("unicen_user_dni")
    }
    return null
  }
}

export async function refreshUserData(): Promise<UserData | null> {
  try {
    const dni = localStorage.getItem("unicen_user_dni")
    if (!dni) return null

    const { data: user, error } = await supabase.from("users").select("*").eq("dni", dni).single()

    if (error) throw error

    // Actualizar cache
    localStorage.setItem("unicen_current_user", JSON.stringify(user))
    return user
  } catch (error) {
    console.error("Error refrescando datos del usuario:", error)
    return null
  }
}
