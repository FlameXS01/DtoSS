import type { Business } from "../types/businessTypes";
import { Link } from "react-router-dom";

interface BusinessCardProps { // parametros
    business: Business
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
    return (
        <Link to={`/business/${business.id}`} className="block">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex-1">
                    <h3 className="font-semibold">
                    {business.business_name || business.legal_name} {business.description || ''}
                    </h3>
                    <p className="text-sm text-gray-600">{business.email}</p>
                    <div className="flex items-center mt-1 space-x-2">
                    {!business.is_verified && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                        No verificado
                        </span>
                    )}
                    </div>
                </div>
            </div>
        </Link>
    )
}