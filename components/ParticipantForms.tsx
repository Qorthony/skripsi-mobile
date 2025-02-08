import { View, Text } from 'react-native'
import React from 'react'
import { Input, InputField } from '@/components/ui/input'
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from "@/components/ui/select"
import { ChevronDownIcon } from "@/components/ui/icon"

export default function ParticipantForms({ className }: { className?: string }) {
    return (
        <View className={className}>
            <Text className='font-semibold'>Peserta 1(Pemesan)</Text>
            <View className='w-10/12'>
                {/* <Text>Nama</Text> */}
                <Input
                    className='mb-2 w-full'
                    variant='underlined'
                    size='sm'
                >
                    <InputField placeholder='Nama Lengkap'></InputField>
                </Input>
                <Input
                    className='mb-2'
                    variant='underlined'
                    size='sm'
                >
                    <InputField placeholder='Email'></InputField>
                </Input>

                <Select className='mb-2'>
                    <SelectTrigger className='w-full items-center flex-row justify-between' variant="underlined" size="sm">
                        <SelectInput className='m-0 p-0' placeholder="Pilih Tiket" />
                        <SelectIcon className="me-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <SelectItem label="UX Research" value="ux" />
                            <SelectItem label="Web Development" value="web" />
                            <SelectItem
                                label="Cross Platform Development Process"
                                value="Cross Platform Development Process"
                            />
                            <SelectItem label="UI Designing" value="ui" isDisabled={true} />
                            <SelectItem label="Backend Development" value="backend" />
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </View>
        </View>
    )
}