import { BsTrashFill, BsLockFill, BsUnlockFill } from "react-icons/bs"

const Toolbar = ({ onAction, someSelected }) => {

	const actions = {
		delete: {
			component: <BsTrashFill />,
			styleClassName: 'danger'
		},
		lock: {
			component: <BsLockFill />,
			styleClassName: 'danger'
		},
		unlock: {
			component: <BsUnlockFill />,
			styleClassName: 'success'
		}
	}

	return (
		<div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
			<div className="btn-group mr-2" role="group" aria-label="First group">
				{Object.entries(actions).map(action => {
					const [actionName, actionCompSettings] = action
					return <button
						key={actionName}
						type="button"
						onClick={() => onAction(actionName)}
						className={`btn btn-outline-${actionCompSettings.styleClassName}`}
						disabled={!someSelected}
					>
						{actionCompSettings.component}
					</button>
				})}
			</div>
		</div>
	)
}

export default Toolbar