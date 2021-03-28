import React from 'react'
import styled from 'styled-components/native'

const getColor = ({ active, color }) => {
	const colors = {
		green: {
			color: '#61BB42',
			background: 'rgba(132, 210, 105, 0.21)',
		},
		blue: {
			color: '#fff',
			background: '#2A86FF',
		},
		default: {
			color: '#4294FF',
			background: '#E9F5FF',
		},
	}

	let result

	if (active) {
		result = colors.blue
	} else if (color && colors[color]) {
		result = colors.green
	} else {
		result = colors.default
	}

	return result
}

export default styled.Text`
	color: ${(props) => getColor(props).color};
	background: ${(props) => getColor(props).background};
	border-width: 0px;
	border-radius: 22px;
	overflow: hidden;
	font-size: 16px;
	height: 45px;
	text-align: center;
	line-height: 45px;
	padding: 0 20px;
`
