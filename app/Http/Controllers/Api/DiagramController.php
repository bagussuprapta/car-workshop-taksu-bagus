<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use function Jawira\PlantUml\encodep;
use Illuminate\Http\Request;

/**
 * Controller for handling diagram-related operations
 */
class DiagramController extends Controller
{
    /**
     * Generate and return State Machine Diagram (SMD) in SVG format
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function smdDiagram()
    {
        $smdPath = public_path('smd.puml');
        $smdCode = file_get_contents($smdPath);
        $encodedSMD = encodep($smdCode);
        $smdPlantumlUrl = "https://www.plantuml.com/plantuml/svg/{$encodedSMD}";

        return response()->json([
            'url' => $smdPlantumlUrl,
        ]);
    }

    /**
     * Generate and return Entity Relationship Diagram (ERD) in SVG format
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function erdDiagram()
    {
        $erdPath = public_path('erd.puml');
        $erdCode = file_get_contents($erdPath);
        $encodedERD = encodep($erdCode);
        $erdPlantumlUrl = "https://www.plantuml.com/plantuml/svg/{$encodedERD}";

        return response()->json([
            'url' => $erdPlantumlUrl,
        ]);
    }
}
