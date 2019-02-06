import { shallowMount } from '@vue/test-utils'
import Problem from './../../src/components/Problem.vue'

describe('Problem.vue', () => {
    it('initializes and sets up correctly', () => {
        const wrapper = shallowMount(Problem)
    
        expect(wrapper.vm.loading).toBe(false)
    
    })

})
