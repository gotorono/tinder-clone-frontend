export const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'gray',
        background: state.isSelected ? "linear-gradient(220deg, rgba(180,58,165,0.925) 0%, rgba(255,78,78,0.925) 100%)" : 'white',
        padding: "1.25em",
        '&:hover' : {
            background: state.isSelected ? 'linear-gradient(220deg, rgba(180,58,165,0.925) 0%, rgba(255,78,78,0.925) 100%)' : '#e9e9e9e9',
            color: state.isSelected ? 'white' : 'black'
        },
        width: 'calc(100% - 6px)',
        margin: '3px',
        borderRadius: '4px'
      }),
      control: (base, state) => ({
          ...base,
          boxShadow: state.isFocused ? 0 : 0,
          borderColor: state.isFocused
            ? 'rgb(180,58,165)' :
            state.hasValue ? 'rgb(180,58,165)'
            : base.borderColor,
          '&:hover': {
            borderColor: 'rgb(180,58,165)',
          }
      }),
      menu: (base, state) => ({
        ...base,
        margin: '2px 0',
        padding: 0,
        border: '1px solid rgb(180,58,165)',
      }),
      menuList: (base, state) => ({
        ...base,
        padding: 0
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 500ms';
        return { ...provided, opacity, transition, color: 'black' };
      }
}