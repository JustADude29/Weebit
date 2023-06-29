import classNames from "classnames"

interface InputGroupProps {
    className?: string
    type: string
    placeholder: string
    value: string
    error: string | undefined
    setValue: (string: string) => void
}

const InputGroup: React.FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    value,
    error,
    setValue,
}) => {
    return <div className={className}>
        <input
            type={type}
            className={classNames("w-full p-3 transition border rounded duraiton-50 bg-fuchsia-950 focus:bg-fuchsia-900 outline-none hover:bg-fuchsia-900 border-fuchsia-800",
                { "border-red-500": error }
            )}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
        />
        <small className="font-medium text-red-500">{error}</small>
    </div>
}

export default InputGroup