import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function CustomSelect({ options, value, onChange, label, dropdownWidthClass, alignLeft }) {
  return (
    <div className="w-full">
      {label && (
        <label className={`block text-lg font-semibold text-gray-700 mb-2 ${alignLeft ? 'text-left' : 'text-center'}`}>{label}</label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full flex flex-col items-center">
          <Listbox.Button className={`w-full cursor-pointer rounded-xl bg-white/80 border border-fuchsia-100 py-2 px-4 text-base text-gray-700 shadow focus:ring-2 focus:ring-fuchsia-300 ${alignLeft ? 'text-left' : 'text-center'}`}> 
            <span className={`block truncate ${alignLeft ? 'text-left' : 'text-center'}`}>{options.find(o => o.value === value)?.label || 'Selecciona un evento'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-fuchsia-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={`absolute left-1/2 -translate-x-1/2 mt-2 max-h-[50vh] overflow-auto bg-transparent focus:outline-none text-base flex flex-col gap-3 z-50 ${alignLeft ? 'items-start' : 'items-center'} ${dropdownWidthClass || 'w-full max-w-xs'}`}>
              {options.map((option, idx) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active, selected }) =>
                    `w-full cursor-pointer select-none relative py-3 px-4 rounded-2xl transition-all duration-150 flex items-center ${alignLeft ? 'justify-start text-left' : 'justify-center text-center'} mx-auto
                    bg-white ${active ? 'ring-2 ring-fuchsia-200 shadow-lg' : 'shadow'}
                    ${selected ? 'font-bold text-fuchsia-600' : 'text-gray-700'}
                    `
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block w-full text-lg ${alignLeft ? 'text-left' : 'text-center'} mx-auto`}>{option.label}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-4 flex items-center">
                          <CheckIcon className="h-5 w-5 text-fuchsia-400" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
