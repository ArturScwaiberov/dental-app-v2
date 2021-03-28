export default (letter) => {
	const charCode = letter.charCodeAt()
	if (
		(charCode >= 1040 && charCode <= 1047) ||
		(charCode >= 65 && charCode <= 70)
	) {
		return {
			background: '#DAD5F8',
			color: '#816CFF',
		}
	}
	if (
		(charCode >= 1048 && charCode <= 1055) ||
		(charCode >= 71 && charCode <= 76)
	) {
		return {
			background: '#F5D6D9',
			color: '#F38181',
		}
	}
	if (
		(charCode >= 1049 && charCode <= 1063) ||
		(charCode >= 77 && charCode <= 83)
	) {
		return {
			background: '#F8ECD5',
			color: '#F1A32F',
		}
	}
	return {
		background: '#E9F5FF',
		color: '#2A86FF',
	}
}
