<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use function Jawira\PlantUml\encodep;

class PlantUmlController extends Controller
{
    /**
     * Generates and displays the State Machine Diagram (SMD)
     * from a local .puml file using PlantUML's SVG rendering.
     */
    public function smdDiagram()
    {
        $smdPath = public_path('smd.puml');
        $smdCode = file_get_contents($smdPath);
        $encodedSMD = encodep($smdCode);
        $smdPlantumlUrl = "https://www.plantuml.com/plantuml/svg/{$encodedSMD}";

        return view('diagram.smd', ['smdPlantumlUrl' => $smdPlantumlUrl]);
    }

    /**
     * Generates and displays the Entity Relationship Diagram (ERD)
     * from a local .puml file using PlantUML's SVG rendering.
     */
    public function erdDiagram()
    {
        $erdPath = public_path('erd.puml');
        $erdCode = file_get_contents($erdPath);
        $encodedERD = encodep($erdCode);
        $erdPlantumlUrl = "https://www.plantuml.com/plantuml/svg/{$encodedERD}";

        return view('diagram.erd', ['erdPlantumlUrl' => $erdPlantumlUrl]);
    }
}
