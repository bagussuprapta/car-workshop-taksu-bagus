<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use function Jawira\PlantUml\encodep;
use Illuminate\Http\Request;

class DiagramController extends Controller
{
    /**
     * Generates and returns the State Machine Diagram (SMD)
     * from a local .puml file using PlantUML's SVG rendering.
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
     * Generates and returns the Entity Relationship Diagram (ERD)
     * from a local .puml file using PlantUML's SVG rendering.
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
