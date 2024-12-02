import { useGetCountStatisticsQuery } from '@/entities/count/api';
import { Filter } from './filter/ui';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { SexChart } from './pie/ui';
import { ClientTypeChart } from './ClientTypeChart';
import { PeakHours } from './PeakHoursChart/ui/PeakHours';
import { AgeChartExample } from './AgeChart/ui/AgeChart';
import { PeakAttendance } from '@/entities/count/model/types';

const clientTypeData: PeakAttendance[] = Array.from({ length: 30 }, () => ({
    time: `${String(Math.floor(Math.random() * 4) + 17).padStart(
        2,
        '0',
    )}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, // Время в диапазоне 17:00–20:59
    client_count: Math.floor(Math.random() * 500 + 500), // Клиенты от 500 до 1000
}));

const ageChart = {
    '1-5': 0,
    '6-10': 0,
    '11-15': 0,
    '16-20': 7,
    '21-25': 208,
    '26-30': 155,
    '31-35': 70,
    '36-40': 45,
    '41-45': 17,
    '46-50': 23,
    '51-55': 17,
    '56-60': 7,
    '61-65': 2,
    '66-70': 4,
    '71-75': 1,
    '76-80': 0,
    '81-85': 0,
    '86+': 0,
};

const AdminCount = () => {
    const [isOneDay, setIsOneDay] = useState<boolean>(true);
    const [day, setDay] = useState<string>(
        new Date().toISOString().slice(0, 10),
    );
    const [dayFromTo, setDayFromTo] = useState<string[]>([]);
    const { data } = useGetCountStatisticsQuery(
        isOneDay
            ? { day }
            : { start_date: dayFromTo[0], end_date: dayFromTo[1] },
    );

    useEffect(() => {
        if (dayFromTo.length < 1) {
            setDay(new Date().toISOString().slice(0, 10));
            setIsOneDay(true);
        }
    }, [dayFromTo]);

    if (!data) {
        return (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Spin spinning />
            </div>
        );
    }
    return (
        <div className="w-full">
            <Filter
                setDay={setDay}
                setIsOneDay={setIsOneDay}
                setDayFromTo={setDayFromTo}
            />
            <div className="flex flex-col xl:flex-row">
                <SexChart count={[34, 66]} data={[34, 66]} />
                <ClientTypeChart data={[52, 98]} />
            </div>
            <div className="flex justify-between">
                <div className="flex-col w-full">
                    <PeakHours
                        day={day}
                        data={clientTypeData.sort((a, b) =>
                            a.time.localeCompare(b.time),
                        )}
                    />
                    <AgeChartExample day={day} data={ageChart} />
                </div>
            </div>
        </div>
    );
};

export { AdminCount };
