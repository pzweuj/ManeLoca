'use client'

import * as Switch from '@radix-ui/react-switch'

interface VersionSwitchProps {
  version: 'GRCh37' | 'GRCh38'
  onVersionChange: (version: 'GRCh37' | 'GRCh38') => void
}

export function VersionSwitch({ version, onVersionChange }: VersionSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm">GRCh37</label>
      <Switch.Root
        checked={version === 'GRCh38'}
        onCheckedChange={(checked) => onVersionChange(checked ? 'GRCh38' : 'GRCh37')}
        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
      </Switch.Root>
      <label className="text-sm">GRCh38</label>
    </div>
  )
}