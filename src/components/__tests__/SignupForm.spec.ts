import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia' // Import the createPinia function from the 'pinia' package

import { mount } from '@vue/test-utils'
import SignupForm from '../SignupForm.vue'

describe('SignupForm', () => {
  it('renders properly', () => {
    const pinia = createPinia() // Create a Pinia instance
    const wrapper = mount(SignupForm, {
      props: { msg: 'Signup Vitest' },
      global: {
        plugins: [pinia] // Use the Pinia instance as a plugin
      }
    })
    expect(wrapper.text()).toContain('Sign Up')
  })
})
