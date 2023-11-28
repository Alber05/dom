import { redirect } from 'react-router-dom'
import { deleteContact } from '../contacts'

export async function action({ params }) {
  console.log(params.contactId)
  try {
    console.log(
      'In action function. Deleting contact with ID:',
      params.contactId
    )
    await deleteContact(params.contactId)
    console.log('Contact deleted successfully.')
    return redirect(`/`)
  } catch (error) {
    console.error('Error deleting contact:', error)
    throw new Error('Failed to delete contact')
  }
}
