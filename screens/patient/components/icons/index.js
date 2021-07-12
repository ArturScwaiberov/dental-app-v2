import React from 'react'
import AnesthesiaIcon from './AnesthesiaIcon'
import ConsultationIcon from './ConsultationIcon'
import DiagnosticIcon from './DiagnosticIcon'
import HygieneIcon from './HygieneIcon'
import ImplantsIcon from './ImplantsIcon'
import OrthoIcon from './OrthoIcon'
import ProstheticsIcon from './ProstheticsIcon'
import RestorationIcon from './RestorationIcon'
import RootCanalIcon from './RootCanalIcon'
import SurgeryIcon from './SurgeryIcon'
import WhiteningIcon from './WhiteningIcon'
import XRayIcon from './XRayIcon'

const SvgIcon = ({ code }) => {
	switch (code) {
		case 'diag':
			return <ConsultationIcon />
		case 'watch':
			return <DiagnosticIcon />
		case 'xray':
			return <XRayIcon />
		case 'anast':
			return <AnesthesiaIcon />
		case 'resto':
			return <RestorationIcon />
		case 'rct':
			return <RootCanalIcon />
		case 'hyg':
			return <HygieneIcon />
		case 'whit':
			return <WhiteningIcon />
		case 'crown':
			return <ProstheticsIcon />
		case 'imp':
			return <ImplantsIcon />
		case 'ortho':
			return <OrthoIcon />
		case 'ext':
			return <SurgeryIcon />
	}
}

export default SvgIcon
