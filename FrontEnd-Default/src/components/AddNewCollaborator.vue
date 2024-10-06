<script setup>
import { addItem } from '@/utils/fetchUtils'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollaboratorManager } from '@/stores/CollaboratorManager'

const deClareemit = defineEmits(['saveCollab', 'cancelCollab', 'errorCollab'])
const isNameOverLimit = ref(false)
const MAX_LENGTH = 50
const route = useRoute()
const router = useRouter()
const errorCollab = ref(false)
const collabManager = useCollaboratorManager()

// Initialize selectedAccessLevel with "READ"
const selectedAccessLevel = ref('READ')

// Define newCollabEmailName with default value
let newCollabEmailName = ref('')

// Owner email (replace with actual owner email)
const ownerEmail = ref('owner@example.com') // Replace with actual owner email

// Invalid email flag
const isInvalidEmail = ref(false)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Check if the input is a valid email and not the owner's email
const validateEmail = () => {
  const email = newCollabEmailName.value

  // Allow if the email is valid and does not match the owner's email, OR if it has the @ad.sit.kmutt.ac.th domain
  isInvalidEmail.value =
    (!emailRegex.test(email) || email === ownerEmail.value) &&
    !email.includes('@ad.sit.kmutt.ac.th')
}

// Check length of the collaborator email and enforce the limit
const checkNameLength = () => {
  if (newCollabEmailName.value.length > MAX_LENGTH) {
    isNameOverLimit.value = true
    newCollabEmailName.value = newCollabEmailName.value.substring(0, MAX_LENGTH)
    setTimeout(() => {
      isNameOverLimit.value = false
    }, 1000)
  } else {
    isNameOverLimit.value = false
  }
}

// Handle adding a new collaborator
const newCollab = async () => {
  if (
    !isInvalidEmail.value &&
    !isNameOverLimit.value &&
    newCollabEmailName.value
  ) {
    // Convert selectedAccessLevel to uppercase before sending
    const newCollabBoards = await addItem(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${route.params.id}/collabs`,
      {
        email: newCollabEmailName.value,
        access_right: selectedAccessLevel.value.toUpperCase() // Ensure it's uppercase
      }
    )

    if (
      newCollabBoards == 401 ||
      newCollabBoards == 403 ||
      newCollabBoards == 404 ||
      newCollabBoards == 409
    ) {
      router.replace({ name: 'Login' })
      return
    }

    collabManager.addCollaborator(newCollabBoards)
    deClareemit('saveCollab', true) // Emit save event
  }
}
</script>
