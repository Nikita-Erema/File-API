export function deleteTodoCard(e) {
    e.target.parentElement.remove()
}

export function checkValidate(input) {
    const text = input.value
    if (text.trim() === '') {
        return false
    } else {
        return true
    }
}