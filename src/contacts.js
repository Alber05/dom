// Importar el paquete localforage para el almacenamiento de datos en el navegador
import localforage from 'localforage'

// Importar las funciones necesarias de los paquetes match-sorter y sort-by para ordenar y filtrar datos
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

// Función para obtener contactos, acepta un parámetro de consulta
export async function getContacts(query) {
  // Simular una red falsa para evitar retrasos
  await fakeNetwork(`getContacts:${query}`)

  // Obtener los contactos de almacenamiento local
  let contacts = await localforage.getItem('contacts')
  if (!contacts) contacts = []

  // Si se proporciona una consulta, filtrar los contactos
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] })
  }

  // Ordenar los contactos por apellido y fecha de creación
  return contacts.sort(sortBy('last', 'createdAt'))
}

// Función para crear un nuevo contacto
export async function createContact() {
  // Simular una red falsa para evitar retrasos
  await fakeNetwork()

  // Generar un ID y la marca de tiempo de creación
  let id = Math.random().toString(36).substring(2, 9)
  let contact = { id, createdAt: Date.now() }

  // Obtener los contactos existentes y agregar el nuevo contacto en la parte superior
  let contacts = await getContacts()
  contacts.unshift(contact)

  // Guardar los contactos actualizados
  await set(contacts)
  return contact
}

// Función para obtener un contacto específico por su ID
export async function getContact(id) {
  // Simular una red falsa para evitar retrasos
  await fakeNetwork(`contact:${id}`)

  // Obtener todos los contactos y encontrar el contacto con el ID especificado
  let contacts = await localforage.getItem('contacts')
  let contact = contacts.find((contact) => contact.id === id)
  return contact ?? null
}

// Función para actualizar un contacto existente por su ID
export async function updateContact(id, updates) {
  // Simular una red falsa para evitar retrasos
  await fakeNetwork()

  // Obtener los contactos y buscar el contacto con el ID especificado
  let contacts = await localforage.getItem('contacts')
  let contact = contacts.find((contact) => contact.id === id)

  // Lanzar un error si no se encuentra el contacto
  if (!contact) throw new Error('No contact found for', id)

  // Aplicar las actualizaciones al contacto encontrado
  Object.assign(contact, updates)

  // Guardar los contactos actualizados
  await set(contacts)
  return contact
}

// Función para eliminar un contacto por su ID
export async function deleteContact(id) {
  // Obtener los contactos y buscar el índice del contacto con el ID especificado
  let contacts = await localforage.getItem('contacts')

  let newContacts = contacts.filter((contact) => contact.id !== id)

  await set(newContacts)
}

// Función para establecer los contactos en el almacenamiento local
function set(contacts) {
  return localforage.setItem('contacts', contacts)
}

// Simular un caché para evitar retrasos en elementos ya vistos
let fakeCache = {}

// Simular una red falsa con un tiempo de espera aleatorio
async function fakeNetwork(key) {
  // Limpiar la caché si no se proporciona ninguna clave
  if (!key) {
    fakeCache = {}
  }

  // Retornar si el valor está en caché
  if (fakeCache[key]) {
    return
  }

  // Añadir el valor a la caché y esperar un tiempo aleatorio
  fakeCache[key] = true
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800)
  })
}
