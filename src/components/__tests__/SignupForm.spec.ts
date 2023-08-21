import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SignupForm from '../SignupForm.vue'

describe('SignupForm', () => {
  it('renders properly', () => {
    const wrapper = mount(SignupForm, { props: { msg: 'Signup Vitest' } })
    expect(wrapper.text()).toContain('Signup Vitest')
  })
})