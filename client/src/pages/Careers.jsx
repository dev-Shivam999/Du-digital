import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCareersState, fetchCareers } from "../redux/slices/careersSlice";
import data from "../data/careers.json";

import CareersHero from "../components/careers/CareersHero";
import WorkingAt from "../components/careers/WorkingAt";
import CareerOpportunities from "../components/careers/CareerOpportunities";
import ApplyModal from "../components/careers/ApplyModal";
import JobDescriptionModal from "../components/careers/JobDescriptionModal";

const Careers = () => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector((state) => state.careers);
    const [applyOpen, setApplyOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobView, setJobView] = useState(null);

    useEffect(() => {
        dispatch(fetchCareers());
    }, [dispatch]);
    useEffect(() => {
       dispatch(clearCareersState())
    }, [jobs])

    return (
        <>
            <CareersHero data={data.hero} />
            <WorkingAt data={data.working} />

            {loading && (
                <div className="py-20 text-center">
                    <p className="text-gray-600">Loading job opportunities...</p>
                </div>
            )}

            {error && (
                <div className="py-20 text-center">
                    <p className="text-[#FF1033]">Error: {error}</p>
                </div>
            )}

            {!loading && !error && (
                <CareerOpportunities
                    jobs={jobs}
                    onApply={(job) => {
                        setSelectedJob(job);
                        setApplyOpen(true);
                    }}
                    onView={setJobView}
                />
            )}

            <ApplyModal
                open={applyOpen}
                job={selectedJob}
                onClose={() => {
                    setApplyOpen(false);
                    setSelectedJob(null);
                }}
            />
            <JobDescriptionModal
                job={jobView}
                onApply={(job) => {
                    setSelectedJob(job);
                    setApplyOpen(true);
                    setJobView(null);
                }}
                onClose={() => setJobView(null)}
            />
        </>
    );
};

export default Careers;
