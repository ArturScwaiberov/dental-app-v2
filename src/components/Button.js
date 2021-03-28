import React from 'react'
import styled from 'styled-components'

const Button = ({ children, color, onPress }) => {
	return (
		<FormulaButton color={color} onPress={onPress}>
			<FormulaButtonText>{children}</FormulaButtonText>
		</FormulaButton>
	)
}

Button.defaultProps = {
	color: '#2A86FF',
}

const FormulaButton = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	border-radius: 40px;
	height: 45px;
	background: ${(props) => (props.color ? props.color : defaultProps)};
`

const FormulaButtonText = styled.Text({
	color: '#fff',
	fontSize: 16,
})

export default Button
